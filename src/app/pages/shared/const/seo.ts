import { PageSeo } from '../models/seo.model';

export const SEO_ROUTE_DATA_KEY = 'seo';

export const SITE_SEO = Object.freeze({
  siteName: 'Ionita Tech',
  baseUrl: 'https://ionitatech.com',
  locale: 'en_US',
  shareImage: {
    url: 'https://ionitatech.com/og-image.jpg',
    width: '1200',
    height: '630',
    alt: 'Ionita Tech — Shaping the Future of Digital Solutions',
  },
});

export const HOME_SEO: PageSeo = {
  title: 'Ionita Tech | Software Development, Cloud & Cybersecurity',
  description:
    'Ionita Tech builds scalable, secure and modern software: IT consulting, custom web and software development, cloud solutions and cybersecurity.',
  path: '/',
};

export const PRIVACY_SEO: PageSeo = {
  title: 'Privacy Policy & Terms | Ionita Tech',
  description:
    'How Ionita Tech handles your data: no cookies or tracking, what the contact form sends through EmailJS, and your rights under GDPR.',
  path: '/privacy',
};
