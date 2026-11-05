/** EmailJS public identifiers. They are meant to be public; abuse is limited by the allowed-origin and rate-limit settings in the EmailJS dashboard. */
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
  /** Messages a visitor can send before reloading the page. */
  maxMessagesPerVisit: 5,
} as const);
