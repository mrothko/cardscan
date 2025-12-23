export type SupportedLanguage = 'zh-TW' | 'zh-CN' | 'en' | 'ja';

export interface ContactData {
  id: string;
  originalImage: string; // Base64 string
  scannedAt: string; // ISO Date string
  surname: string;
  givenName: string;
  title: string;
  company: string;
  mobilePhones: string[]; // Changed from single string to array
  workPhone: string;
  fax: string;
  emails: string[];
  address: string;
  website: string;
}

export enum AppState {
  HOME,
  SCANNING,
  EDITING,
  SAVED
}