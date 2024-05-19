import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Post } from 'src/dto/post.dto';
import { Post as PrismaPost } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async getPosts(): Promise<Post[]> {
    return (await this.databaseService.post.findMany()) as Post[];
  }

  async getPostsByUserId(id: number): Promise<Post[]> {
    return (await this.databaseService.post.findMany({
      where: { userId: id },
    })) as Post[];
  }

  async createPost(post: Post) {
    console.log(post);
    await this.databaseService.post.create({
      data: post as PrismaPost,
    });
  }

  async deletePost(id: number) {
    await this.databaseService.post.delete({
      where: { id: id },
    });
  }
}
