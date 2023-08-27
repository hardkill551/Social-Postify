import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';

@Injectable()
export class PublicationsService {
  constructor(private readonly publicationRepository:PublicationsRepository){}
  async create(createPublicationDto: CreatePublicationDto) {
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
