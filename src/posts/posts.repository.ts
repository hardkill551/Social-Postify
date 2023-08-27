import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostRepository{

    constructor(private readonly prisma:PrismaService){}

    getPost(post:CreatePostDto | UpdatePostDto){
        return this.prisma.posts.findFirst({
            where:post
        })
    }

    createPost(data:CreatePostDto){
        return this.prisma.posts.create({
            data
        })
    }

    getAllPosts(){
        return this.prisma.posts.findMany()
    }

    getPostbyId(id:number){
        return this.prisma.posts.findUnique({
            where:{
                id
            }
        })
    }
    
    updatePost(id:number, data:UpdatePostDto){
        return this.prisma.posts.update({
            data,
            where:{id}
        })
    }

    deletePost(id:number){
        return this.prisma.posts.delete({
            where:{
                id
            }
        })
    }
}
