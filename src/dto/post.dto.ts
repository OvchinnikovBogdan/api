export class Post {
  id?: number;
  createdAt?: Date;
  userId?: number;
  name: string;
  description: string;
  type: string;
  status: 'open' | 'close' | 'inProcess';
  location: string;
}
