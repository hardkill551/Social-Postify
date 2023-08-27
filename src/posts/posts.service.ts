import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    const post = await this.postRepository.getPostbyId(id)
    if(!post){
      throw new NotFoundException()
    }
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const originalPost = await this.postRepository.getPostbyId(id)
    if(!originalPost){
      throw new NotFoundException()
    }
    return await this.postRepository.updatePost(id, updatePostDto)
  }

  async remove(id: number) {
    if(isNaN(id)){
      throw new NotFoundException()
    }
    const originalPost = await this.postRepository.getPostbyId(id)
    if(!originalPost){
      throw new NotFoundException()
    }
    return await this.postRepository.deletePost(id)
  }
}
