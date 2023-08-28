import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';

@Module({
  imports: [forwardRef(() => MediasModule), forwardRef(() => PostsModule)],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository, PostsRepository, MediasRepository],
})
export class PublicationsModule {}
