import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';

@Module({
  imports: [PostsModule, MediasModule],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository, PostsRepository, MediasRepository],
})
export class PublicationsModule {}
