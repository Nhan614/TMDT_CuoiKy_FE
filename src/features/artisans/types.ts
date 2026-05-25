export interface Artisan {
  id: number;
  name: string;
  tag: string;
  image: string;
  rating: number;
  quote: string;
  experience: string;
  orders: string;
  featured?: boolean;
}

export interface PageResponse {
  content: Artisan[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}