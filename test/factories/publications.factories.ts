import { PrismaService } from "src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

export async function createFuturePublication(prisma:PrismaService, mediaId:number, postId:number) {
        const data = {mediaId, postId, date:faker.date.between({ from: '2023-09-15T00:00:00.000Z', to: '2030-09-30T00:00:00.000Z' })}
    return await prisma.publications.create({
        data
    })

}
export async function createPastPublication(prisma:PrismaService, mediaId:number, postId:number) {
    const data = {mediaId, postId, date:faker.date.between({ from: '2023-08-01T00:00:00.000Z', to: '2023-08-25T00:00:00.000Z' })}
return await prisma.publications.create({
    data
})

}
export async function deleteAll(prisma:PrismaService) {
    const deletedPublication = await prisma.publications.deleteMany()
    await prisma.media.deleteMany()
    await prisma.posts.deleteMany()
    return deletedPublication

}