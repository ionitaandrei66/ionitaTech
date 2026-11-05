export type SectionId = 'home' | 'about' | 'services' | 'contact';

export interface NavItem {
  readonly label: string;
  readonly target: SectionId;
}

export interface FeatureCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}
