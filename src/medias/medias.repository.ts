import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createMedia(createMediaDto: CreateMediaDto) {
    return await this.prisma.medias.create({
      data: createMediaDto
    })
  }

  async findUserMedia(createMediaDto: CreateMediaDto) {
    return await this.prisma.medias.findFirst({
      where: {
        title: createMediaDto.title,
        username: createMediaDto.username
      }
    })
  }

  async findAll() {
    return await this.prisma.medias.findMany()
  }

  async findOne(id: number) {
    return this.prisma.medias.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return this.prisma.medias.update({
      where:{
        id: Number(id)
      },
      data: {
        title: updateMediaDto.title,
        username: updateMediaDto.username
      }
    })
  }

  remove(id: number) {
    return this.prisma.medias.delete({
      where:{
        id: Number(id)
      }
    })
  }
}
