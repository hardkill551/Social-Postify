import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediasService {

  constructor(private readonly mediaRepository:MediaRepository){
  }
  async create(createMediaDto: CreateMediaDto) {
    const media = await this.mediaRepository.getMedia(createMediaDto)
    if(media){
      throw new ConflictException()
    }
    return await this.mediaRepository.postMedia(createMediaDto)
  }

  async findAll() {
    const media = await this.mediaRepository.getAllMedias()
    return media
  }

  async findOne(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const media = await this.mediaRepository.getMediabyId(id)
    if(!media){
      throw new NotFoundException()
    }
    return media
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const originalMedia = await this.mediaRepository.getMediabyId(id)
    if(!originalMedia){
      throw new NotFoundException()
    }
    const sameMedia = await this.mediaRepository.getMedia(updateMediaDto)
    if(sameMedia){
      throw new ConflictException()
    }
    return await this.mediaRepository.updateMedia(id, updateMediaDto)
  }

  async remove(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const originalMedia = await this.mediaRepository.getMediabyId(id)
    if(!originalMedia){
      throw new NotFoundException()
    }
    return await this.mediaRepository.deleteMedia(id)
  }
}
