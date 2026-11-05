import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { NOTICE_POINTS } from '../../const/legal-info';
import { ConsentService } from '../../services/consent.service';

@Component({
  selector: 'app-consent-gate',
  imports: [RouterLink],
  templateUrl: './consent-gate.component.html',
  styleUrl: './consent-gate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsentGateComponent {
  private static readonly SCROLL_LOCK_CLASS = 'it-scroll-locked';
  private static readonly UNGATED_PATHS: readonly string[] = ['/privacy'];

  private readonly consentService = inject(ConsentService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly isBrowserReady = signal(false);
  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: '/' },
  );

  protected readonly points = NOTICE_POINTS;
  protected readonly hasDeclined = signal(false);
  protected readonly isVisible = computed(
    () =>
      this.isBrowserReady() &&
      !this.consentService.accepted() &&
      !ConsentGateComponent.UNGATED_PATHS.includes(this.currentPath()),
  );

  public constructor() {
    afterNextRender(() => this.isBrowserReady.set(true));

    effect(() => {
      this.document.documentElement.classList.toggle(ConsentGateComponent.SCROLL_LOCK_CLASS, this.isVisible());
    });

    effect(() => {
      const dialog = this.dialog()?.nativeElement;

      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    });
  }

  protected accept(): void {
    this.consentService.accept();
  }

  protected decline(): void {
    this.hasDeclined.set(true);
  }

  protected preventClosing(event: Event): void {
    event.preventDefault();
  }
}
