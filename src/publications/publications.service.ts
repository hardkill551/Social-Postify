import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsService } from 'src/posts/posts.service';
import { MediasService } from 'src/medias/medias.service';

@Injectable()
export class PublicationsService {
  constructor(private readonly publicationRepository:PublicationsRepository, private readonly postsService:PostsService, private readonly mediaService:MediasService){}
  async create(createPublicationDto: CreatePublicationDto) {
    await Promise.all([
      this.postsService.findOne(createPublicationDto.postId),
      this.mediaService.findOne(createPublicationDto.mediaId)
    ])
    
    const publication = await this.publicationRepository.createPublication(createPublicationDto)
    return publication
  }

  async findAll() {
    const publication = await this.publicationRepository.getAllPublications()
    return publication
  }

  findOne(id: number) {
    return `This action returns a #${id} publication`;
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
