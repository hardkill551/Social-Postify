import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const publication = await this.publicationRepository.getPublicationsbyId(id)
    if(!publication){
      throw new NotFoundException()
    }
    return publication
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const originalPublication = await this.publicationRepository.getPublicationsbyId(id)
    const currentDate = new Date()
    const publicationDate = new Date(originalPublication.date)
    if(publicationDate.getTime() < currentDate.getTime()){
      throw new ForbiddenException()
    }
    if(!originalPublication){
      throw new NotFoundException()
    }
    return await this.publicationRepository.updatePublications(id, updatePublicationDto)
  }

  async remove(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const originalPublication = await this.publicationRepository.getPublicationsbyId(id)
    if(!originalPublication){
      throw new NotFoundException()
    }
    return await this.publicationRepository.deletePublications(id)
  }
}
