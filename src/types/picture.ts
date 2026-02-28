// export interface Picture {
//   id: number;
//   fileKey: string;
//   name: string | null;
//   type: string;
// }

interface PictureTranslation {
  languageCode: 'en' | 'hu';
  name: string;
}

export interface Picture {
  id: number;
  fileKey: string;
  type: string;
  translations: PictureTranslation[];
  name?: string | null;
  userId: string;
  createdAt: Date | null;
}