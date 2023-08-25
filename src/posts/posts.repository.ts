import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createPost(createPostDto: CreatePostDto) {
    return await this.prisma.posts.create({
      data: createPostDto
    })
  }

  async findAll() {
    return await this.prisma.posts.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.posts.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  async update(id: number, updatePostDto: CreatePostDto) {
    return await this.prisma.posts.update({
      where: {
        id: Number(id)
      },
      data: {
        title: updatePostDto.title,
        text: updatePostDto.text
      }
    })
  }

  async remove(id: number) {
    return await this.prisma.posts.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
