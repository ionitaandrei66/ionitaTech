import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

import { ConsentGateComponent } from './pages/shared/components/consent-gate/consent-gate.component';
import { ToastContainerComponent } from './pages/shared/components/toast-notification/toast.component';
import { AppUpdateService } from './pages/shared/services/app-update.service';

const SITE_URL = 'https://ionitatech.com';
const SITE_TITLE = 'Ionita Tech | Modern Software Services';
const SITE_DESCRIPTION =
  'Ionita Tech delivers scalable, secure, and modern software solutions — from consulting and custom development to cloud and cybersecurity.';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, ConsentGateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly meta = inject(Meta);
  private readonly appUpdateService = inject(AppUpdateService);

  public ngOnInit(): void {
    this.updateMetaTags();
    this.appUpdateService.watchForUpdates();
  }

  private updateMetaTags(): void {
    this.meta.updateTag({ name: 'description', content: SITE_DESCRIPTION });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Ionita Tech, software services, software development, IT consulting, cloud computing, cybersecurity, web applications',
    });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Ionita Tech' });
    this.meta.updateTag({ property: 'og:title', content: SITE_TITLE });
    this.meta.updateTag({ property: 'og:description', content: SITE_DESCRIPTION });
    this.meta.updateTag({ property: 'og:url', content: SITE_URL });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/og-image.jpg` });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: 'Ionita Tech — Shaping the Future of Digital Solutions',
    });
  }
}
