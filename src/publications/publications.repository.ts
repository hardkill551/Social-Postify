import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";

@Injectable()
export class PublicationsRepository{

    constructor(private readonly prisma:PrismaService){}

    getPublication(publication:CreatePublicationDto | UpdatePublicationDto){
        return this.prisma.publications.findFirst({
            where:publication
        })
    }

    createPublication(data:CreatePublicationDto){
        return this.prisma.publications.create({
            data
        })
    }

    getAllPublications(){
        return this.prisma.publications.findMany()
    }

    getPublicationsbyId(id:number){
        return this.prisma.publications.findUnique({
            where:{
                id
            }
        })
    }
    
    updatePublications(id:number, data:UpdatePublicationDto){
        return this.prisma.publications.update({
            data,
            where:{id}
        })
    }

    deletePublications(id:number){
        return this.prisma.publications.delete({
            where:{
                id
            }
        })
    }
}
