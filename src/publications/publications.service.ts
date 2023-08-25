import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationRepository: PublicationsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly mediasRepository: MediasRepository
  ) { }

  async createPublication(createPublicationDto: CreatePublicationDto) {
    if (!createPublicationDto.mediaId || !createPublicationDto.postId || !createPublicationDto.date) {
      throw new BadRequestException()
    }

    const mediaFind = await this.mediasRepository.findOne(Number(createPublicationDto.mediaId))
    if(!mediaFind) throw new NotFoundException()

    const postFind = await this.postsRepository.findOne(Number(createPublicationDto.postId))  
    if (!postFind) throw new NotFoundException()

    return await this.publicationRepository.createPublication(createPublicationDto)
  }

  async findAll() {
    return await this.publicationRepository.findAll()
  }

  async findOne(id: number) {
    const findPublication = await this.publicationRepository.findOne(id)
    if (!findPublication) throw new NotFoundException()

    return findPublication
  }

  async update(id: number, updatePublicationDto: CreatePublicationDto) {
    const findPublication = await this.publicationRepository.findOne(id)
    if (!findPublication) throw new NotFoundException()

    const mediaFind = await this.mediasRepository.findOne(Number(updatePublicationDto.mediaId))
    if(!mediaFind) throw new NotFoundException()

    const postFind = await this.postsRepository.findOne(Number(updatePublicationDto.postId))  
    if (!postFind) throw new NotFoundException()

    const timePost = findPublication.date.getTime()
    const timeNow = new Date().getTime()

    if(timePost < timeNow) {
      throw new ForbiddenException()
    } 

    return await this.publicationRepository.update(id, updatePublicationDto)
  }

  async remove(id: number) {
    const findPublication = await this.publicationRepository.findOne(id)
    if (!findPublication) throw new NotFoundException()
    
    return await this.publicationRepository.remove(id)
  }
}
