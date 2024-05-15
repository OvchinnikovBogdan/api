import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Post as PostDecorator,
  Body,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Post } from 'src/dto/post.dto';

class PostedPost {
  userId: number;
  name: string;
  description: string;
  type: string;
  status: 'open' | 'close';
  location: string;
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAll(@Request() req): Promise<Post[]> {
    if ((await this.userService.findOne(req.user.username)).role !== 'admin')
      throw new UnauthorizedException();
    return await this.postsService.getPosts();
  }

  @Get('my')
  @UseGuards(AuthGuard)
  async getMy(@Request() req): Promise<Post[]> {
    const user = await this.userService.findOne(req.user.username);
    return await this.postsService.getPostsByUserId(user.id);
  }

  @PostDecorator()
  @UseGuards(AuthGuard)
  async addPost(@Request() req, @Body() post: PostedPost) {
    if ((await this.userService.findOne(req.user.username)).role !== 'user')
      throw new UnauthorizedException();
    const user = await this.userService.findOne(req.user.username);
    const { name, description, type, location } = post;
    const postData: Post = {
      userId: user.id,
      name,
      description,
      type,
      status: 'open',
      location,
    } as Post;
    return await this.postsService.createPost(postData);
  }
}
