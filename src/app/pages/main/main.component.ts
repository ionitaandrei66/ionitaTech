import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, inject, signal, DOCUMENT } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { PlanetSceneComponent } from '../components/scene/planet-scene.component';
import { COMPANY_INFO } from '../shared/const/legal-info';
import { ABOUT_CARDS, NAV_ITEMS, SERVICE_CARDS } from '../shared/const/site-content';
import { RevealOnScrollDirective } from '../shared/directives/reveal-on-scroll.directive';
import { SectionId } from '../shared/models/site-content.model';

@Component({
  selector: 'app-main',
  imports: [PlanetSceneComponent, ContactFormComponent, RevealOnScrollDirective, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private static readonly HEADER_SCROLL_THRESHOLD = 10;

  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly navItems = NAV_ITEMS;
  protected readonly aboutCards = ABOUT_CARDS;
  protected readonly serviceCards = SERVICE_CARDS;
  protected readonly company = COMPANY_INFO;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly isScrolled = signal(false);

  public constructor() {
    this.trackHeaderState();
  }

  protected scrollTo(sectionId: SectionId): void {
    this.document.getElementById(sectionId)?.scrollIntoView({ block: 'start' });
  }

  private trackHeaderState(): void {
    const view = this.document.defaultView;

    if (!view) {
      return;
    }

    const onScroll = (): void => {
      const scrolled = view.scrollY > MainComponent.HEADER_SCROLL_THRESHOLD;

      if (scrolled !== this.isScrolled()) {
        this.ngZone.run(() => this.isScrolled.set(scrolled));
      }
    };

    this.ngZone.runOutsideAngular(() => view.addEventListener('scroll', onScroll, { passive: true }));
    this.destroyRef.onDestroy(() => view.removeEventListener('scroll', onScroll));
  }
}
