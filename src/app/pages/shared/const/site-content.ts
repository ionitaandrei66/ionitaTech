import { FeatureCard, NavItem } from '../models/site-content.model';

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', target: 'home' },
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
];

export const ABOUT_CARDS: readonly FeatureCard[] = [
  {
    icon: '◎',
    title: 'Our Mission',
    description:
      'To innovate and deliver cutting edge solutions that empower our clients and create measurable business value.',
  },
  {
    icon: '◇',
    title: 'Our Values',
    description: 'Integrity, innovation and impact guide every decision from discovery to delivery.',
  },
  {
    icon: '</>',
    title: 'How We Work',
    description: 'We use short iterations, clear communication and continuous feedback.',
  },
  {
    icon: '↗',
    title: 'Our Services',
    description: 'From product discovery and UX design to scalable backend systems.',
  },
];

export const SERVICE_CARDS: readonly FeatureCard[] = [
  {
    icon: '☷',
    title: 'Consulting',
    description: 'Expert advice to optimize your technology strategy and operations.',
  },
  {
    icon: '</>',
    title: 'Software',
    description: 'Custom software solutions to drive innovation and efficiency.',
  },
  {
    icon: '☁',
    title: 'Cloud',
    description: 'Efficient and scalable cloud solutions tailored to your business needs.',
  },
  {
    icon: '◇',
    title: 'Cybersecurity',
    description: 'Robust security measures to protect your data and infrastructure.',
  },
];
