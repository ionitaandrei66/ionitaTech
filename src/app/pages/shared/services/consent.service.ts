import { Injectable, signal } from '@angular/core';

import { NOTICE_VERSION } from '../const/legal-info';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private static readonly STORAGE_KEY = 'it-notice-accepted';

  private readonly _accepted = signal<boolean>(this.readAcceptedVersion() === NOTICE_VERSION);
  public readonly accepted = this._accepted.asReadonly();

  public accept(): void {
    this.writeAcceptedVersion(NOTICE_VERSION);
    this._accepted.set(true);
  }

  private readAcceptedVersion(): string | null {
    try {
      return localStorage.getItem(ConsentService.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private writeAcceptedVersion(version: string): void {
    try {
      localStorage.setItem(ConsentService.STORAGE_KEY, version);
    } catch {
    }
  }
}
