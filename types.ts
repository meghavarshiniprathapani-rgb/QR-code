
export interface SafetyRating {
  score: number;
  locationId: string;
  timestamp: number;
  tags: string[];
  comment?: string;
  coords?: {
    latitude: number;
    longitude: number;
  };
}

export interface LocationMetadata {
  id: string;
  name: string;
  zone: string;
}

export enum ViewState {
  INITIAL = 'INITIAL',
  RATING = 'RATING',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
