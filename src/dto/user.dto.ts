export class User {
  id: number;
  login: string;
  password: string;
  role: TypeRole;
}

type TypeRole = 'Admin' | 'User';
