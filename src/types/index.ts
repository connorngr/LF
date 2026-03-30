export interface ImageData {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  imageUrl: string;
  category: string;
  folder: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  bio: string;
  avatar: string;
  isVerified?: boolean;
  stats: {
    followers: number;
    posts: number;
  };
}
