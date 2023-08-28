import { Injectable } from "@nestjs/common";
import { CreateMediaDto } from "./dto/create-media.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Injectable()
export class MediaRepository{

    constructor(private readonly prisma:PrismaService){}

    getMedia(media:CreateMediaDto | UpdateMediaDto){
        return this.prisma.media.findFirst({
            where:{
                title:media.title,
                username:media.username
            }
        })
    }

    postMedia(data:CreateMediaDto){
        return this.prisma.media.create({
            data
        })
    }

    getAllMedias(){
        return this.prisma.media.findMany()
    }

    getMediabyId(id:number){
        return this.prisma.media.findUnique({
            where:{
                id
            }
        })
    }
    
    updateMedia(id:number, data:UpdateMediaDto){
        return this.prisma.media.update({
            data,
            where:{id}
        })
    }

    deleteMedia(id:number){
        return this.prisma.media.delete({
            where:{
                id
            }
        })
    }
}
