import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  async create(@Body() createMediaDto: CreateMediaDto) {
    return await this.mediasService.createMedia(createMediaDto);
  }

  @Get()
  async findAll() {
    return await this.mediasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.mediasService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMediaDto: UpdateMediaDto) {
    return await this.mediasService.update(id, updateMediaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.mediasService.remove(id);
  }
}
