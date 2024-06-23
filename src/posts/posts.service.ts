import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Post, PostToUpdate } from 'src/dto/post.dto';
import { Post as PrismaPost } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly databaseService: DatabaseService) {}

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

  async update(id: number, post: PostToUpdate) {
    return await this.databaseService.post.update({
      where: { id },
      data: post,
    });
  }
}
