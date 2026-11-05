import { DOCUMENT, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { HOME_SEO, SEO_ROUTE_DATA_KEY, SITE_SEO } from '../const/seo';
import { PageSeo } from '../models/seo.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  public watchRoutes(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.apply(this.readPageSeo()));
  }

  private readPageSeo(): PageSeo {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return (route.data[SEO_ROUTE_DATA_KEY] as PageSeo | undefined) ?? HOME_SEO;
  }

  private apply(page: PageSeo): void {
    const url = `${SITE_SEO.baseUrl}${page.path}`;

    this.title.setTitle(page.title);
    this.setCanonicalUrl(url);

    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_SEO.siteName });
    this.meta.updateTag({ property: 'og:locale', content: SITE_SEO.locale });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: SITE_SEO.shareImage.url });
    this.meta.updateTag({ property: 'og:image:width', content: SITE_SEO.shareImage.width });
    this.meta.updateTag({ property: 'og:image:height', content: SITE_SEO.shareImage.height });
    this.meta.updateTag({ property: 'og:image:alt', content: SITE_SEO.shareImage.alt });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: page.title });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: SITE_SEO.shareImage.url });
    this.meta.updateTag({ name: 'twitter:image:alt', content: SITE_SEO.shareImage.alt });
  }

  private setCanonicalUrl(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }

    link.href = url;
  }
}
