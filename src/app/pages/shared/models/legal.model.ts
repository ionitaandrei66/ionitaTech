export interface CompanyInfo {
  readonly legalName: string;
  readonly website: string;
}

export interface PolicySection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}
