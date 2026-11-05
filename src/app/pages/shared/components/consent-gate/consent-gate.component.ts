
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, DOCUMENT } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

import { NOTICE_POINTS } from '../../const/legal-info';
import { ConsentService } from '../../services/consent.service';

/** Full-screen notice that blocks the website until the visitor accepts the conditions. */
@Component({
    selector: 'app-consent-gate',
    imports: [RouterLink],
    templateUrl: './consent-gate.component.html',
    styleUrl: './consent-gate.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsentGateComponent {
  private static readonly SCROLL_LOCK_CLASS = 'it-scroll-locked';
  /** The policy must stay readable before accepting, otherwise visitors would accept blindly. */
  private static readonly UNGATED_PATHS: readonly string[] = ['/privacy'];

  private readonly consentService = inject(ConsentService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

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
    () => !this.consentService.accepted() && !ConsentGateComponent.UNGATED_PATHS.includes(this.currentPath()),
  );

  public constructor() {
    effect(() => {
      this.document.documentElement.classList.toggle(ConsentGateComponent.SCROLL_LOCK_CLASS, this.isVisible());
    });
  }

  protected accept(): void {
    this.consentService.accept();
  }

  protected decline(): void {
    this.hasDeclined.set(true);
  }
}
