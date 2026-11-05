import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CONTACT_LIMITS, EMAILJS_PRIVACY_URL } from '../../shared/const/contact';
import {
  ContactFormControls,
  ContactFormField,
  ContactMessage,
  ContactSendError,
} from '../../shared/models/contact.model';
import { ContactService } from '../../shared/services/contact.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private static readonly TOO_MANY_REQUESTS = 429;

  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly renderedAt = Date.now();

  public readonly labelledBy = input<string | null>(null);

  protected readonly limits = CONTACT_LIMITS;
  protected readonly emailJsPrivacyUrl = EMAILJS_PRIVACY_URL;
  protected readonly isSending = signal(false);

  protected readonly form: FormGroup<ContactFormControls> = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(CONTACT_LIMITS.nameMaxLength)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(CONTACT_LIMITS.emailMaxLength)]],
    message: ['', [Validators.required, Validators.maxLength(CONTACT_LIMITS.messageMaxLength)]],
    website: [''],
    privacyAccepted: [false, Validators.requiredTrue],
  });

  protected isInvalid(field: ContactFormField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
    if (this.form.invalid || this.isSending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSending.set(true);

    this.contactService
      .send(this.buildMessage(), Date.now() - this.renderedAt)
      .pipe(
        finalize(() => this.isSending.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toastService.success('Message sent. We will get back to you soon!', { title: 'Thank you' });
          this.form.reset();
        },
        error: (error: unknown) => this.toastService.error(this.toErrorMessage(error), { title: 'Error' }),
      });
  }

  private buildMessage(): ContactMessage {
    const { name, email, message, website } = this.form.getRawValue();

    return {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website,
    };
  }

  private toErrorMessage(error: unknown): string {
    const isRateLimited =
      error instanceof ContactSendError ||
      (error as { status?: number } | null)?.status === ContactFormComponent.TOO_MANY_REQUESTS;

    return isRateLimited
      ? 'Too many messages in a short time. Please try again later.'
      : 'Something went wrong. Please try again.';
  }
}
