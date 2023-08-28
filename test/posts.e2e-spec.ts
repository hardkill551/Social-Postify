import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createPosts, deletePostsItens } from './factories/posts.factories';

let app: INestApplication;
let prisma: PrismaService
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, PrismaModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  prisma = app.get(PrismaService)
  await app.init();
  await deletePostsItens(prisma)
});

describe('PostsController (POST-e2e)', () => {
  it('/posts (POST), should return 201 and the post object', async () => {
    const post = {
        title: "Why you should have a guinea pig?",
        text: "https://www.guineapigs.com/why-you-should-guinea",
        }
    const createdPost = await request(app.getHttpServer())
      .post('/posts')
      .send(post)
      expect(createdPost.status).toBe(201)
      expect(createdPost.body).toEqual({...post, id:createdPost.body.id, image:null})
  });
  it('/posts (POST), should return 400 because the text is missing', async () => {
    const post = {
        title: "Why you should have a guinea pig?",
        image: "https://www.guineapigs.com/why-you-should-guinea",
        }
    const createdPost = await request(app.getHttpServer())
      .post('/posts')
      .send(post)
      expect(createdPost.status).toBe(400)
  });
});


describe('PostsController (GET-e2e)', () => {
    it('/posts (GET), should return 200 and the post object list', async () => {
        createPosts(prisma, 1)
        createPosts(prisma, 2)
        createPosts(prisma, 1)
        createPosts(prisma, 2)

        const allPost = await request(app.getHttpServer())
        .get('/posts')
        expect(allPost.status).toBe(200)
        expect(allPost.body).toEqual(expect.arrayContaining([expect.objectContaining({})]))
    });
    it('/posts (GET), should return 200 and the post object list empty', async () => {
        const allPost = await request(app.getHttpServer())
        .get('/posts')
        expect(allPost.status).toBe(200)
        expect(allPost.body).toHaveLength(0)
        expect(allPost.body).toEqual([])
    });
    it('/posts (GET), should return 200 and the post object', async () => {
        const createdPost = await createPosts(prisma, 1)
        const post = await request(app.getHttpServer())
        .get(`/posts/${createdPost.id}`)
        expect(post.status).toBe(200)
        expect(post.body).toEqual(createdPost)
    });
    it('/posts (GET), should return 404', async () => {
        const post = await request(app.getHttpServer())
        .get(`/posts/1`)
        expect(post.status).toBe(404)
    });
  });


  describe('PostsController (PUT-e2e)', () => {

    it('/posts (PUT), should return 200 and the updated post object ', async () => {
        const createdPost = await createPosts(prisma, 1)
        const updatedPost = {title:"aeba"}
        const post = await request(app.getHttpServer())
        .put(`/posts/${createdPost.id}`).send(updatedPost)
        expect(post.status).toBe(200)
        expect(post.body).toEqual({id:createdPost.id, title:"aeba", text:expect.any(String), image:expect.any(String)})
    });
    it('/posts (PUT), should return 404', async () => {
        const allPost = await request(app.getHttpServer())
        .put(`/posts/1`).send({title:"aeba"})
        expect(allPost.status).toBe(404)
    });
  });

  describe('PostsController (DELETE-e2e)', () => {

    it('/posts (DELETE), should return 200 and the deleted post object ', async () => {
        const createdPost = await createPosts(prisma, 1)
        const post = await request(app.getHttpServer())
        .delete(`/posts/${createdPost.id}`)
        expect(post.status).toBe(200)
        expect(post.body).toEqual(createdPost)
    });
    it('/posts (DELETE), should return 404', async () => {
        const allPost = await request(app.getHttpServer())
        .delete(`/posts/1`)
        expect(allPost.status).toBe(404)
    });
    //it('/posts (DELETE), should return 403', async () => {
    //    const createdPost = await createPosts(prisma, 1)
    //    const allPost = await request(app.getHttpServer())
    //    .delete(`/posts/${createdPost.id}`)
    //    expect(allPost.status).toBe(403)
    //});
  });