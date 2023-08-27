import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaRepository } from './media.repository';

@Module({
  imports:[PrismaModule],
  controllers: [MediasController],
  providers: [MediasService, MediaRepository],
  exports:[MediasService]
})
export class MediasModule {}
