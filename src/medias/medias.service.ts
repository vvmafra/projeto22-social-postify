import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  constructor(
    private readonly mediaRepository: MediasRepository,
    private readonly publicationRepository: PublicationsRepository
    ) {}

  async createMedia(createMediaDto: CreateMediaDto) {
    if (!createMediaDto.title || !createMediaDto.username) throw new BadRequestException()

    const userFind = await this.mediaRepository.findUserMedia(createMediaDto)
    if (userFind) throw new ConflictException()
    
    return await this.mediaRepository.createMedia(createMediaDto)
  }

  async findAll() {
    return await this.mediaRepository.findAll()
  }

  async findOne(id: number) {
    return await this.mediaRepository.findOne(id)
  }

  async update(id: number, updateMediaDto: CreateMediaDto) {
    const findUserMedia = await this.mediaRepository.findOne(id)
    if (!findUserMedia) throw new NotFoundException()

    const userFind = await this.mediaRepository.findUserMedia(updateMediaDto)
    if (userFind) throw new ConflictException()

    return await this.mediaRepository.update(id, updateMediaDto)
  }

  async remove(id: number) {
    const findUserMedia = await this.mediaRepository.findOne(id)
    if (!findUserMedia) throw new NotFoundException()

    const findPubliMediaId = await this.publicationRepository.findOneMediaID(id)
    if (findPubliMediaId) throw new ForbiddenException()

    return await this.mediaRepository.remove(id)
  }
}
