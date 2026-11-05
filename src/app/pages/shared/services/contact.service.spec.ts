import { TestBed } from '@angular/core/testing';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { firstValueFrom } from 'rxjs';

import { CONTACT_SPAM_GUARD } from '../const/contact';
import { ContactMessage, ContactSendError } from '../models/contact.model';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  const message: ContactMessage = { name: 'Ana', email: 'ana@example.com', message: 'Hello', website: '' };
  const humanFillTime = CONTACT_SPAM_GUARD.minFillTimeMs + 1;

  let service: ContactService;
  let sendSpy: jasmine.Spy;

  beforeEach(() => {
    localStorage.removeItem(CONTACT_SPAM_GUARD.storageKey);
    sendSpy = spyOn(emailjs, 'send').and.resolveTo(new EmailJSResponseStatus(200, 'OK'));
    service = TestBed.inject(ContactService);
  });

  afterEach(() => localStorage.removeItem(CONTACT_SPAM_GUARD.storageKey));

  it('sends a normal message through EmailJS', async () => {
    await firstValueFrom(service.send(message, humanFillTime));

    expect(sendSpy).toHaveBeenCalledTimes(1);
  });

  it('silently drops messages with the honeypot filled in', async () => {
    await firstValueFrom(service.send({ ...message, website: 'spam.example' }, humanFillTime));

    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('silently drops forms filled in faster than a person could', async () => {
    await firstValueFrom(service.send(message, CONTACT_SPAM_GUARD.minFillTimeMs - 1));

    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('enforces the cooldown between messages, also across page reloads', async () => {
    await firstValueFrom(service.send(message, humanFillTime));

    await expectAsync(firstValueFrom(TestBed.inject(ContactService).send(message, humanFillTime))).toBeRejectedWith(
      jasmine.any(ContactSendError),
    );
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });

  it('stops after the maximum number of messages per window', async () => {
    const outsideCooldown = Date.now() - CONTACT_SPAM_GUARD.cooldownMs - 1;
    const previousSends = Array.from({ length: CONTACT_SPAM_GUARD.maxMessagesPerWindow }, () => outsideCooldown);
    localStorage.setItem(CONTACT_SPAM_GUARD.storageKey, JSON.stringify(previousSends));

    await expectAsync(firstValueFrom(service.send(message, humanFillTime))).toBeRejectedWith(
      jasmine.any(ContactSendError),
    );
    expect(sendSpy).not.toHaveBeenCalled();
  });
});
