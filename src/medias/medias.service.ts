import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediaRepository: MediasRepository) {}

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

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const findUserMedia = await this.mediaRepository.findOne(id)
    if (!findUserMedia) throw new NotFoundException()

    const userFind = await this.mediaRepository.findUserMedia(updateMediaDto)
    if (userFind) throw new ConflictException()

    return await this.mediaRepository.update(id, updateMediaDto)
  }

  async remove(id: number) {
    const findUserMedia = await this.mediaRepository.findOne(id)
    if (!findUserMedia) throw new NotFoundException()

    // A media só pode ser deletada se não estiver fazendo 
    //parte de nenhuma publicação (agendada ou publicada). 
    //Neste caso, retornar o status code 403 Forbidden.

    return await this.mediaRepository.remove(id)
  }
}
