export interface ImageData {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  imageUrl: string;
  category: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
