import { FormControl } from '@angular/forms';

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly website: string;
}

export type ContactSendErrorReason = 'rate_limited';

export class ContactSendError extends Error {
  public constructor(public readonly reason: ContactSendErrorReason) {
    super(reason);
  }
}

export interface ContactFormControls {
  readonly name: FormControl<string>;
  readonly email: FormControl<string>;
  readonly message: FormControl<string>;
  readonly website: FormControl<string>;
  readonly privacyAccepted: FormControl<boolean>;
}

export type ContactFormField = keyof ContactFormControls;
