import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContactFormComponent } from '../components/contact-form/contact-form.component';
import { PlanetSceneComponent } from '../components/scene/planet-scene.component';
import { SiteHeaderComponent } from '../components/site-header/site-header.component';
import { COMPANY_INFO } from '../shared/const/legal-info';
import { ABOUT_CARDS, NAV_ITEMS, SERVICE_CARDS } from '../shared/const/site-content';
import { RevealOnScrollDirective } from '../shared/directives/reveal-on-scroll.directive';
import { SectionId } from '../shared/models/site-content.model';

@Component({
  selector: 'app-main',
  imports: [PlanetSceneComponent, SiteHeaderComponent, ContactFormComponent, RevealOnScrollDirective, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly navItems = NAV_ITEMS;
  protected readonly aboutCards = ABOUT_CARDS;
  protected readonly serviceCards = SERVICE_CARDS;
  protected readonly company = COMPANY_INFO;
  protected readonly currentYear = new Date().getFullYear();

  protected followSectionLink(event: Event, sectionId: SectionId): void {
    event.preventDefault();
    this.navigateTo(sectionId);
  }

  protected navigateTo(sectionId: SectionId): void {
    const section = this.document.getElementById(sectionId);

    section?.scrollIntoView({ block: 'start' });
    section?.focus({ preventScroll: true });
  }
}
