import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit {
  private readonly logger = new Logger(UsersModule.name);

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const adminExists = await this.usersService.checkAdminExists();
    if (!adminExists) {
      this.logger.log('Creating default admin');
      await this.usersService.createDefaultAdmin();
      this.logger.log('Admin created: login - admin, password - admin');
    }

    const usersExist = await this.usersService.checkUsersExist();
    if (!usersExist) {
      this.logger.log('Creating 10 test users');
      await this.usersService.createTestUsers();
      this.logger.log('Users created: logins user1-user10, password - user');
    }
  }
}
