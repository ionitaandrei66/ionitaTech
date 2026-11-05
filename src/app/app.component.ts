import { ChangeDetectionStrategy, Component, DOCUMENT, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConsentGateComponent } from './pages/shared/components/consent-gate/consent-gate.component';
import { ToastContainerComponent } from './pages/shared/components/toast-notification/toast.component';
import { AppUpdateService } from './pages/shared/services/app-update.service';
import { SeoService } from './pages/shared/services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, ConsentGateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly appUpdateService = inject(AppUpdateService);
  private readonly document = inject(DOCUMENT);

  public ngOnInit(): void {
    this.seoService.watchRoutes();
    this.appUpdateService.watchForUpdates();
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main-content')?.focus();
  }
}
