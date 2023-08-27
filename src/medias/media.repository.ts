import { Injectable } from "@nestjs/common";
import { CreateMediaDto } from "./dto/create-media.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MediaRepository{

    constructor(private readonly prisma:PrismaService){}

    getMedia(media:CreateMediaDto){
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
}
