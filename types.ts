export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
  ageRange: string;
  description: string;
  color: string;
  icon: string;
}

export enum BikeLevel {
  BEGINNER = 'Tiny Gliders',
  INTERMEDIATE = 'Little Striders',
  ADVANCED = 'Speed Racers'
}