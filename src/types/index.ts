export interface User {
  id: string;
  name: string;
  email: string;
  apifyKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchParams {
  typeOfBusiness: string;
  subCategory?: string;
  location: string;
  maxResults: number;
}

export interface BusinessResult {
  title?: string;
  name?: string;
  url?: string;
  website?: string;
  phone?: string;
  phoneUnformatted?: string;
  address?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  rating?: number;
  reviewsCount?: number;
  totalScore?: number;
  categoryName?: string;
  categories?: string[];
  description?: string;
  email?: string;
  openingHours?: OpeningHour[];
  imageUrl?: string;
  thumbnailUrl?: string;
  temporarilyClosed?: boolean;
  permanentlyClosed?: boolean;
  placeId?: string;
  googleMapsUrl?: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface OtpSendResponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}
