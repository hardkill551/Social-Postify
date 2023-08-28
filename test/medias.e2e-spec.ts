
import * as request from 'supertest';
import { createMedias } from './factories/medias.factories';
import { createPosts } from './factories/posts.factories';
import { createFuturePublication, deleteAll } from './factories/publications.factories';
import { app, prisma } from './app.e2e-spec';
beforeEach(async () => {
    await deleteAll(prisma)
  });
describe('MediasController (POST-e2e)', () => {
  it('/medias (POST), should return 201 and the media object', async () => {
    const media = {
        title: "Instagram",
        username: "myusername",
        }
    const createdMedia = await request(app.getHttpServer())
      .post('/medias')
      .send(media)
      expect(createdMedia.status).toBe(201)
      expect(createdMedia.body).toEqual({...media, id:createdMedia.body.id})
  });
  it('/media (POST), should return 400 because the username is missing', async () => {
    const media = {
        title: "Why you should have a guinea pig?"
        }
    const createdMedia = await request(app.getHttpServer())
      .post('/medias')
      .send(media)
      expect(createdMedia.status).toBe(400)
  });
  it('/media (POST), should return 409 because it is duplicated', async () => {
    const media = await createMedias(prisma)
    const createdMedia = await request(app.getHttpServer())
      .post('/medias')
      .send({title:media.title, username:media.username})
      expect(createdMedia.status).toBe(409)
  });
});


describe('MediasController (GET-e2e)', () => {
    it('/medias (GET), should return 200 and the media object list', async () => {
        createMedias(prisma)
        createMedias(prisma)
        createMedias(prisma)
        createMedias(prisma)

        const allMedias = await request(app.getHttpServer())
        .get('/medias')
        expect(allMedias.status).toBe(200)
        expect(allMedias.body).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String)
        })]))
    });
    it('/medias (GET), should return 200 and the media object list empty', async () => {
        const allMedias = await request(app.getHttpServer())
        .get('/medias')
        expect(allMedias.status).toBe(200)
        expect(allMedias.body).toHaveLength(0)
        expect(allMedias.body).toEqual([])
    });
    it('/medias (GET), should return 200 and the media object', async () => {
        const createdMedia = await createMedias(prisma)
        const media = await request(app.getHttpServer())
        .get(`/medias/${createdMedia.id}`)
        expect(media.status).toBe(200)
        expect(media.body).toEqual(createdMedia)
    });
    it('/medias (GET), should return 404', async () => {
        const media = await request(app.getHttpServer())
        .get(`/medias/1`)
        expect(media.status).toBe(404)
    });
  });


describe('MediasController (PUT-e2e)', () => {

    it('/medias (PUT), should return 200 and the updated media object ', async () => {
        const createdMedia = await createMedias(prisma)
        const updatedMedia = {username:"aeba"}
        const media = await request(app.getHttpServer())
        .put(`/medias/${createdMedia.id}`).send(updatedMedia)
        expect(media.status).toBe(200)
        expect(media.body).toEqual({id:createdMedia.id, username:"aeba", title:expect.any(String)})
    });
    it('/medias (PUT), should return 404', async () => {
        const allMedias = await request(app.getHttpServer())
        .put(`/medias/1`).send({title:"aeba"})
        expect(allMedias.status).toBe(404)
    });
    it('/medias (PUT), should return 409 because it is duplicated', async () => {
        const media1 = await createMedias(prisma)
        const media2 = await createMedias(prisma)

        const allMedias = await request(app.getHttpServer())
        .put(`/medias/${media2.id}`).send({title:media1.title, username:media1.username})
        expect(allMedias.status).toBe(409)
    });
});

describe('MediasController (DELETE-e2e)', () => {

    it('/medias (DELETE), should return 200 and the deleted media object ', async () => {
        const createdMedia = await createMedias(prisma)
        const media = await request(app.getHttpServer())
        .delete(`/medias/${createdMedia.id}`)
        expect(media.status).toBe(200)
        expect(media.body).toEqual(createdMedia)
    });
    it('/medias (DELETE), should return 404', async () => {
        const media = await request(app.getHttpServer())
        .delete(`/medias/1`)
        expect(media.status).toBe(404)
    });
    it('/medias (DELETE), should return 403', async () => {
        const createdMedia = await createMedias(prisma)
        const createdPost = await createPosts(prisma, 1)
        await createFuturePublication(prisma, createdMedia.id, createdPost.id)
        const allMedias = await request(app.getHttpServer())
        .delete(`/medias/${createdMedia.id}`)
        expect(allMedias.status).toBe(403)
    });
});

