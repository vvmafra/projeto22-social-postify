import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async create(@Body() createPublicationDto: CreatePublicationDto) {
    const postId = createPublicationDto.postId
    const mediaId = createPublicationDto.mediaId
    const date = createPublicationDto.date
    return await this.publicationsService.createPublication(postId, mediaId, date);
  }

  @Get()
  async findAll() {
    return await this.publicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.publicationsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePublicationDto: CreatePublicationDto) {
    return await this.publicationsService.update(id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.publicationsService.remove(id);
  }
}
