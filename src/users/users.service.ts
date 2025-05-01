import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne(login: string): Promise<User> {
    return (await this.databaseService.user.findFirst({
      where: {
        login: login,
      },
    })) as User;
  }

  async add(user: User) {
    await this.databaseService.user.create({
      data: {
        login: user.login,
        password: user.password,
        role: user.role,
      },
    });
  }

  async update(user: User) {
    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        login: user.login,
        password: user.password,
        role: user.role,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return (await this.databaseService.user.findFirst({
      where: {
        id: id,
      },
    })) as User;
  }

  async checkAdminExists(): Promise<boolean> {
    const admin = await this.databaseService.user.findFirst({
      where: { role: 'admin' },
    });
    return !!admin;
  }

  async createDefaultAdmin(): Promise<void> {
    const adminUser = {
      login: 'admin',
      password: 'admin',
      role: 'admin',
    };
    await this.add(adminUser as User);
  }

  async checkUsersExist(): Promise<boolean> {
    const user = await this.databaseService.user.findFirst({
      where: { role: 'user' },
    });
    return !!user;
  }

  async createTestUsers(): Promise<void> {
    for (let i = 1; i <= 10; i++) {
      await this.add({
        login: `user${i}`,
        password: 'user',
        role: 'user',
      } as User);
    }
  }
}
