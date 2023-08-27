import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException("Conflito", HttpStatus.CONFLICT)
    }
    return await this.mediaRepository.postMedia(createMediaDto)
  }

  findAll() {
    return `This action returns all medias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
