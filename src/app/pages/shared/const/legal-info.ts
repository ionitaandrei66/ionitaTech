import { CompanyInfo, PolicySection } from '../models/legal.model';
import { EMAILJS_PRIVACY_URL } from './contact';

export const COMPANY_INFO: CompanyInfo = Object.freeze({
  legalName: 'IonitaTech S.R.L.',
  website: 'ionitatech.com',
});

export const POLICY_LAST_UPDATED = '5 November 2026';

/** Bump when the notice text changes, so every visitor has to accept the new version. */
export const NOTICE_VERSION = '2026-11-05-emailjs';

/** Short points shown in the full-screen notice every visitor must accept. */
export const NOTICE_POINTS: readonly string[] = [
  'We do not use cookies, analytics, advertising or tracking.',
  'The contact form is delivered by EmailJS, an external (third-party) service. When you send a message, your name, email address and message are transmitted to EmailJS, which emails them to us.',
  'EmailJS processes this data under its own privacy policy and may pass it on to its own providers (for example hosting and email delivery companies), which can be located outside the European Union.',
  'If you do not want this, do not use the contact form. To use this website you must accept these conditions.',
];

export const PRIVACY_SECTIONS: readonly PolicySection[] = [
  {
    heading: '1. Who we are',
    paragraphs: [
      `${COMPANY_INFO.legalName} operates ${COMPANY_INFO.website} and decides how the personal data described below is used.`,
      'For any question about your data, contact us through the contact form on our homepage.',
    ],
  },
  {
    heading: '2. What data we collect',
    paragraphs: [
      'Contact form: your name, email address and the message you write. This data is only sent when you press "Send message".',
      'Technical data: our hosting provider keeps standard server logs (IP address, browser type, date and time of the request) to keep the website secure and working.',
      'Local storage: your browser remembers that you accepted our conditions, so we do not ask again. This value never leaves your device.',
      'We do not use cookies, analytics, advertising, tracking pixels or social media plugins.',
    ],
  },
  {
    heading: '3. Third party: EmailJS',
    paragraphs: [
      'The contact form is delivered by EmailJS (emailjs.com), an external service we use to send the form to our inbox. When you send a message, your name, email address and message are transmitted directly from your browser to EmailJS, together with technical data such as your IP address.',
      'EmailJS processes this data under its own privacy policy and may keep a copy for its own records. It may pass the data on to its own sub-processors, such as hosting and email delivery providers, some of which can be located outside the European Union.',
      `You can read how EmailJS handles data at ${EMAILJS_PRIVACY_URL}.`,
      'If you do not agree to this, please do not use the contact form.',
    ],
  },
  {
    heading: '4. Why we use your data and on what legal basis',
    paragraphs: [
      'We use contact form data only to answer your request and, if you wish, to prepare an offer. The legal basis is your consent, given through the checkbox in the form (Art. 6(1)(a) GDPR), and taking steps at your request before entering into a contract (Art. 6(1)(b) GDPR).',
      'Server logs are based on our legitimate interest in keeping the website secure (Art. 6(1)(f) GDPR).',
    ],
  },
  {
    heading: '5. Who else receives your data',
    paragraphs: [
      'Apart from EmailJS (see section 3), your message reaches our email provider, where we read it, and our hosting provider, which runs this website.',
      'We do not sell, rent or share your data for marketing purposes.',
    ],
  },
  {
    heading: '6. How long we keep it',
    paragraphs: [
      'We keep contact messages for as long as needed to handle your request and at most 12 months afterwards, unless a contract follows, in which case the legal retention periods for contracts apply.',
      'Copies kept by EmailJS are subject to its own retention rules.',
    ],
  },
  {
    heading: '7. Your rights',
    paragraphs: [
      'You have the right to access, rectify or erase your data, to restrict or object to its processing, to data portability and to withdraw your consent at any time, without affecting processing done before the withdrawal.',
      'To exercise these rights, contact us through the contact form. We answer within one month.',
      'You can also lodge a complaint with the Romanian data protection authority, ANSPDCP (www.dataprotection.ro).',
    ],
  },
  {
    heading: '8. Security',
    paragraphs: [
      'The website is served only over HTTPS and sends security headers that block common attacks. Apart from EmailJS, no external scripts are loaded.',
    ],
  },
  {
    heading: '9. Terms of use',
    paragraphs: [
      'To use this website you must accept this policy and these terms, including the use of EmailJS described in section 3.',
      'The content is for information only and does not constitute a binding offer.',
      `All texts, graphics and code on this website belong to ${COMPANY_INFO.legalName} and may not be copied without permission.`,
      'You agree not to misuse the website or the contact form, for example by sending spam or attempting to break its security.',
      'These terms are governed by Romanian law.',
    ],
  },
  {
    heading: '10. Changes',
    paragraphs: ['If we change this policy, we publish the new version on this page and ask you to accept it again.'],
  },
];
