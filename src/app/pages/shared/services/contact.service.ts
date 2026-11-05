import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from, map, of, throwError } from 'rxjs';

import { CONTACT_SPAM_GUARD, EMAILJS_CONFIG } from '../const/contact';
import { ContactMessage, ContactSendError } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  public send(message: ContactMessage, fillDurationMs: number): Observable<void> {
    if (message.website || fillDurationMs < CONTACT_SPAM_GUARD.minFillTimeMs) {
      return of(undefined);
    }

    const now = Date.now();
    const recentSends = this.readRecentSends(now);

    if (this.isRateLimited(recentSends, now)) {
      return throwError(() => new ContactSendError('rate_limited'));
    }

    const templateParams = { name: message.name, email: message.email, message: message.message };

    return from(
      emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, {
        publicKey: EMAILJS_CONFIG.publicKey,
      }),
    ).pipe(map(() => this.writeRecentSends([...recentSends, now])));
  }

  private isRateLimited(recentSends: readonly number[], now: number): boolean {
    const lastSend = recentSends.at(-1);
    const inCooldown = lastSend !== undefined && now - lastSend < CONTACT_SPAM_GUARD.cooldownMs;

    return inCooldown || recentSends.length >= CONTACT_SPAM_GUARD.maxMessagesPerWindow;
  }

  private readRecentSends(now: number): number[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(CONTACT_SPAM_GUARD.storageKey) ?? '[]');

      return Array.isArray(stored)
        ? stored.filter((time): time is number => typeof time === 'number' && now - time < CONTACT_SPAM_GUARD.windowMs)
        : [];
    } catch {
      return [];
    }
  }

  private writeRecentSends(sends: readonly number[]): void {
    try {
      localStorage.setItem(CONTACT_SPAM_GUARD.storageKey, JSON.stringify(sends));
    } catch {
    }
  }
}
