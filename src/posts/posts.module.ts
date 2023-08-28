import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PublicationsModule } from '../publications/publications.module';
import { PublicationsRepository } from '../publications/publications.repository';

@Module({
  imports: [forwardRef(() => PublicationsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PublicationsRepository],
})
export class PostsModule {}
