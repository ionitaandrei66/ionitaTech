import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private static readonly NOTICE_DURATION_MS = 8000;

  private readonly swUpdate = inject(SwUpdate);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  public watchForUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.toastService.info('A new version of the website is available. Refresh the page to see it.', {
          title: 'Update ready',
          durationMs: AppUpdateService.NOTICE_DURATION_MS,
        }),
      );
  }
}
