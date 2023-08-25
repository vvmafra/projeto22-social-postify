import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createPublication(createPublicationDto: CreatePublicationDto) {
    return await this.prisma.publications.create({
      data: {
        postId: createPublicationDto.postId,
        mediaId: createPublicationDto.mediaId,
        date: createPublicationDto.date
      } 
    })
  }

  async findAll() {
    return await this.prisma.publications.findMany()
  }

  async findOne(id: number) {
    return await this.prisma.publications.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  async update(id: number, updatePublicationDto: CreatePublicationDto) {
    return await this.prisma.publications.update({
      where: {
        id: Number(id)
      },
      data: {
        postId: updatePublicationDto.postId,
        mediaId: updatePublicationDto.mediaId,
        date: updatePublicationDto.date
      }
    })
  }

  async remove(id: number) {
    return await this.prisma.publications.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
