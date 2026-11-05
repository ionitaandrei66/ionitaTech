import { ChangeDetectionStrategy, Component, DOCUMENT, DestroyRef, NgZone, inject, input, output, signal } from '@angular/core';

import { NavItem, SectionId } from '../../shared/models/site-content.model';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closeMenu()' },
})
export class SiteHeaderComponent {
  private static readonly SCROLL_THRESHOLD = 10;

  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  public readonly navItems = input.required<readonly NavItem[]>();
  public readonly navigate = output<SectionId>();

  protected readonly isScrolled = signal(false);
  protected readonly isMenuOpen = signal(false);

  public constructor() {
    this.trackScrollState();
  }

  protected navigateTo(sectionId: SectionId): void {
    this.closeMenu();
    this.navigate.emit(sectionId);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  private trackScrollState(): void {
    const view = this.document.defaultView;

    if (!view) {
      return;
    }

    const onScroll = (): void => {
      const scrolled = view.scrollY > SiteHeaderComponent.SCROLL_THRESHOLD;

      if (scrolled !== this.isScrolled()) {
        this.ngZone.run(() => this.isScrolled.set(scrolled));
      }
    };

    this.ngZone.runOutsideAngular(() => view.addEventListener('scroll', onScroll, { passive: true }));
    this.destroyRef.onDestroy(() => view.removeEventListener('scroll', onScroll));
  }
}
