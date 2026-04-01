import { Category, ImageData, PersonalInfo } from ".";

export const categories: Category[] = [
  { id: 'nature', name: 'Nature', icon: '🌳' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'animals', name: 'Animals', icon: '🦄' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'building', name: 'Building', icon: '🏢' },
  { id: 'sport', name: 'Sport', icon: '⚽' },
  { id: 'car', name: 'Car', icon: '🚗' },
];

export const sampleImages: ImageData[] = [
  {
    id: '1',
    title: 'Mountain Landscape',
    author: { name: 'Devin Lane' },
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
    category: 'nature',
    folder: 'Landscapes',
  },
  {
    id: '2',
    title: 'Tech Setup',
    author: { name: 'Cameron Williamson' },
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    category: 'technology',
    folder: 'Workspace',
  },
  {
    id: '3',
    title: 'Wildlife Photography',
    author: { name: 'Kristin Watson' },
    imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
    category: 'animals',
    folder: 'Wildlife',
  },
  {
    id: '4',
    title: 'Gourmet Dish',
    author: { name: 'Guy Hawkins' },
    imageUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
    category: 'food',
    folder: 'Food & Dining',
  },
  {
    id: '5',
    title: 'Modern Architecture',
    author: { name: 'Theresa Webb' },
    imageUrl: 'https://images.unsplash.com/photo-1556909114-4b1c31c9410c?w=800',
    category: 'building',
    folder: 'Architecture',
  },
  {
    id: '6',
    title: 'Soccer Match',
    author: { name: 'Ralph Edwards' },
    imageUrl: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?w=800',
    category: 'sport',
    folder: 'Sports',
  },
  {
    id: '7',
    title: 'Classic Car',
    author: { name: 'Jenny Wilson' },
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    category: 'car',
    folder: 'Vehicles',
  },
  {
    id: '8',
    title: 'Forest Path',
    author: { name: 'Devin Lane' },
    imageUrl: 'https://images.unsplash.com/photo-1556909172-45b7abe8b7e1?w=800',
    category: 'nature',
    folder: 'Landscapes',
  },
  {
    id: '9',
    title: 'Desert Landscape',
    author: { name: 'Devin Lane' },
    imageUrl: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
    category: 'nature',
    folder: 'Landscapes',
  },
];

export const samplePersonalInfo: PersonalInfo = {
  name: 'Sophie Bennett',
  bio: 'Product Designer who focuses on simplicity & usability.',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
  isVerified: true,
  stats: {
    followers: 312,
    posts: 48,
  },
};