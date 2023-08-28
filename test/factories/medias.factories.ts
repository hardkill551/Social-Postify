import { PrismaService } from "src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export async function createMedias(prisma:PrismaService, number:number) {
    const data = {title:faker.animal.cetacean(), username:faker.person.firstName()}
    return await prisma.media.create({
        data
    })

}

export async function deleteMediaItens(prisma:PrismaService) {
    return await prisma.media.deleteMany()

}