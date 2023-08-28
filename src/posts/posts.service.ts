import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly publicationRepository: PublicationsRepository
    ) {}

  async createPost(createPostDto: CreatePostDto) {
    if (!createPostDto.text || !createPostDto.title) throw new BadRequestException()

    return await this.postsRepository.createPost(createPostDto)
  }

  async findAll() {
    return await this.postsRepository.findAll()
  }

  async findOne(id: number) {
    const postFind = await this.postsRepository.findOne(id)
    if (!postFind) throw new NotFoundException()

    return postFind
  }

  async update(id: number, updatePostDto: CreatePostDto) {
    const postFind = await this.postsRepository.findOne(id)
    if (!postFind) throw new NotFoundException()

    return await this.postsRepository.update(id, updatePostDto)
  }

  async remove(id: number) {
    const postFind = await this.postsRepository.findOne(id)
    if (!postFind) throw new NotFoundException()

    const findPubliMediaId = await this.publicationRepository.findOnePostID(id)
    if (findPubliMediaId.length > 0) throw new ForbiddenException()

    return await this.postsRepository.remove(id)
  }
}
