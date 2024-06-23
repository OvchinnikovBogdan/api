import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  Post as PostDecorator,
  Body,
  Delete,
  ParseIntPipe,
  Param,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { Post, PostToUpdate } from 'src/dto/post.dto';

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
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'user') throw new UnauthorizedException();
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

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deletePost(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();
    return await this.postsService.deletePost(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() post: PostToUpdate,
  ) {
    const user = await this.userService.findOne(req.user.username);
    if (user.role !== 'admin') throw new UnauthorizedException();
    return await this.postsService.update(id, post);
  }
}
