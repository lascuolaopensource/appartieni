// src/data/types.ts
export interface Service {
  id: string;
  name: string;
  description?: string;
  stock: number;
  points_reward: number;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  geo?: { lat: number; lon: number };
}

export interface ServiceRecord /* singolo record PB */ {
  id: string;
  name: string;
  venue_id: string;
  expand?: {
    venue: Venue[];
  };
}
