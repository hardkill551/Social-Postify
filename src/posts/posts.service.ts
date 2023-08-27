import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository:PostRepository){}
  async create(createPostDto: CreatePostDto) {
    return await this.postRepository.createPost(createPostDto)
  }

  async findAll() {
    const post = await this.postRepository.getAllPosts()
    return post
  }

  async findOne(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const media = await this.postRepository.getPostbyId(id)
    if(!media){
      throw new NotFoundException()
    }
    return media
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const originalMedia = await this.postRepository.getPostbyId(id)
    if(!originalMedia){
      throw new NotFoundException()
    }
    return await this.postRepository.updatePost(id, updatePostDto)
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
