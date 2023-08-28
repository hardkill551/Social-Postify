import * as request from 'supertest';
import { createMedias } from './factories/medias.factories';
import { createPosts } from './factories/posts.factories';
import { createFuturePublication, createPastPublication, deleteAll } from './factories/publications.factories';
import { app, prisma } from './app.e2e-spec';

beforeEach(async () => {
    await deleteAll(prisma)
  });

describe('PublicationsController (POST-e2e)', () => {
  it('/publications (POST), should return 201 and the publication object', async () => {
    const createdMedia = await createMedias(prisma)
    const createdPost = await createPosts(prisma, 1)
    const publication = {
        mediaId: createdMedia.id,
        postId: createdPost.id,
        date: "2024-08-21T13:25:17.352Z"
    }
    
    const createdPublication = await request(app.getHttpServer())
      .post('/publications')
      .send(publication)
      expect(createdPublication.status).toBe(201)
      expect(createdPublication.body).toEqual({...publication, id:createdPublication.body.id})
  });
  it('/publication (POST), should return 400 because the mediaId is missing', async () => {
    const publication = {
        postId: 2,
        date: "2024-08-21T13:25:17.352Z"
    }
    const createdPublication = await request(app.getHttpServer())
      .post('/publications')
      .send(publication)
      expect(createdPublication.status).toBe(400)
  });
  it('/publications (POST), should return 201 and the publication object', async () => {
    const publication = {
        mediaId: -2,
        postId: 5,
        date: "2024-08-21T13:25:17.352Z"
    }
    
    const createdPublication = await request(app.getHttpServer())
      .post('/publications')
      .send(publication)
      expect(createdPublication.statusCode).toBe(404)
  });
});
describe('PublicationsController (GET-e2e)', () => {
    it('/publications (GET), should return 200 and the publication object list', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 1)
        const createdMedia2 = await createMedias(prisma)
        const createdPost2 = await createPosts(prisma, 2)
        await createFuturePublication(prisma, createdMedia.id, createdPost.id)
        await createFuturePublication(prisma, createdMedia2.id, createdPost.id)
        await createFuturePublication(prisma, createdMedia.id, createdPost2.id)
        await createFuturePublication(prisma, createdMedia2.id, createdPost2.id)

        const allPublications = await request(app.getHttpServer())
        .get('/publications')
        expect(allPublications.status).toBe(200)
        expect(allPublications.body).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String)
        })]))
    });
    it('/publications (GET), should return 200 and the publication object list empty', async () => {
        const allPublications = await request(app.getHttpServer())
        .get('/publications')
        expect(allPublications.status).toBe(200)
        expect(allPublications.body).toHaveLength(0)
        expect(allPublications.body).toEqual([])
    });
    it('/publications (GET), should return 200 and the publication object', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 1)
        const createdPublications = await createFuturePublication(prisma, createdMedia.id, createdPost.id)

        const publication = await request(app.getHttpServer())
        .get(`/publications/${createdPublications.id}`)
        expect(publication.status).toBe(200)
        expect(publication.body).toEqual({...createdPublications, date:expect.any(String)})
    });
    it('/publications (GET), should return 404', async () => {
        const publication = await request(app.getHttpServer())
        .get(`/publications/1`)
        expect(publication.status).toBe(404)
    });
  });


describe('PublicationsController (PUT-e2e)', () => {

    it('/publications (PUT), should return 200 and the updated publication object ', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 1)
        const createdMedia2 = await createMedias(prisma)
        const createdPost2 = await createPosts(prisma, 2)
        const createdPublication = await createFuturePublication(prisma, createdMedia.id, createdPost.id)

        const updatedPublication = {mediaId:createdMedia2.id, postId:createdPost2.id}
        const publication = await request(app.getHttpServer())
        .put(`/publications/${createdPublication.id}`).send(updatedPublication)
        expect(publication.status).toBe(200)
        expect(publication.body).toEqual({id:createdPublication.id, mediaId:createdMedia2.id, postId:createdPost2.id, date:expect.any(String)})
    });

    it('/publications (PUT), should return 404', async () => {
        const allPublications = await request(app.getHttpServer())
        .put(`/publications/1`).send({mediaId:1, postId:100})
        expect(allPublications.status).toBe(404)
    });
    it('/publications (PUT), should return 403 and the publication already published ', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 1)
        const createdMedia2 = await createMedias(prisma)
        const createdPost2 = await createPosts(prisma, 2)
        const createdPublication = await createPastPublication(prisma, createdMedia.id, createdPost.id)

        const updatedPublication = {mediaId:createdMedia2.id, postId:createdPost2.id}
        const publication = await request(app.getHttpServer())
        .put(`/publications/${createdPublication.id}`).send(updatedPublication)
        expect(publication.status).toBe(403)
    });
});

describe('PublicationsController (DELETE-e2e)', () => {

    it('/publications (DELETE), should return 200 and the deleted publication object ', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 2)
        const createdPublication = await createFuturePublication(prisma, createdMedia.id, createdPost.id)
        const publication = await request(app.getHttpServer())
        .delete(`/publications/${createdPublication.id}`)
        expect(publication.status).toBe(200)
        expect(publication.body).toEqual({...createdPublication, date:expect.any(String)})
    });
    it('/publications (DELETE), should return 404', async () => {
        const publication = await request(app.getHttpServer())
        .delete(`/publications/1`)
        expect(publication.status).toBe(404)
    });

});


