import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { ListAllEntities } from "./dto/list-all-dto";

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

    getAllPublications(query:ListAllEntities){
        let where = {}
        const currentDate = new Date()
        if(query && typeof query.published === "string"){
            if(query.published === "true"){
                where = {...where, date: {lte:currentDate}}
            }
            else if(query.published === "false"){
                where = {...where, date: {gt:currentDate}}
            }
        }
        if(query && typeof query.after === "string"){
            const afterDate = new Date(query.after);
                where = { ...where,
                        date: {
                        gte: afterDate,
                    },
        };
        }
        return this.prisma.publications.findMany({where})
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
