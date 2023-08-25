import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

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

    //O post só pode ser deletado se não estiver fazendo 
    //parte de nenhuma publicação (agendada ou publicada). 
    //Neste caso, retornar o status code 403 Forbidden.

    return await this.postsRepository.remove(id)
  }
}
