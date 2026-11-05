export const EMAILJS_CONFIG = Object.freeze({
  serviceId: 'andreitech_3rndi43',
  templateId: 'template_kz2hfqw',
  publicKey: 'fWCwNDXWBZCf4yauk',
} as const);

export const EMAILJS_PRIVACY_URL = 'https://www.emailjs.com/legal/privacy-policy/';

export const CONTACT_LIMITS = Object.freeze({
  nameMaxLength: 100,
  emailMaxLength: 254,
  messageMaxLength: 2000,
} as const);

export const CONTACT_SPAM_GUARD = Object.freeze({
  minFillTimeMs: 3000,
  maxMessagesPerWindow: 3,
  windowMs: 60 * 60 * 1000,
  cooldownMs: 30 * 1000,
  storageKey: 'it-contact-sent-at',
} as const);
