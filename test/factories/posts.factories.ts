import { PrismaService } from "src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export async function createPosts(prisma:PrismaService, number:number) {
    let data:{
        title:string,
        text:string,
        image?:string
    };
    if(number===1){
        data = {title:faker.animal.cetacean(), text:faker.person.bio(), image:faker.animal.cat()}
    }
    else{
        data = {title:faker.animal.cetacean(), text:faker.person.bio()}
    }
    return await prisma.posts.create({
        data
    })

}

export async function deletePostsItens(prisma:PrismaService) {
    return await prisma.posts.deleteMany()

}