import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from, map, of, throwError } from 'rxjs';

import { CONTACT_LIMITS, EMAILJS_CONFIG } from '../const/contact';
import { ContactMessage, ContactSendError } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private sentMessages = 0;

  /** Sends the message through EmailJS, the third-party service disclosed in the privacy notice. */
  public send(message: ContactMessage): Observable<void> {
    // Honeypot filled in: pretend success so bots learn nothing.
    if (message.website) {
      return of(undefined);
    }

    if (this.sentMessages >= CONTACT_LIMITS.maxMessagesPerVisit) {
      return throwError(() => new ContactSendError('rate_limited'));
    }

    const templateParams = { name: message.name, email: message.email, message: message.message };

    return from(
      emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, {
        publicKey: EMAILJS_CONFIG.publicKey,
      }),
    ).pipe(
      map(() => {
        this.sentMessages++;
      }),
    );
  }
}
