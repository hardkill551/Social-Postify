import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();
    let prisma: PrismaService
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService)
    await app.init();
  });

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
