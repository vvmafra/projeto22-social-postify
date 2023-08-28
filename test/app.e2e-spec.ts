import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())

    await prisma.publications.deleteMany()
    await prisma.medias.deleteMany()
    await prisma.posts.deleteMany()

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('I’m okay!');
  });

  //MEDIAS
  //Post Media

  it('/medias (POST)', async () => {
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: faker.company.name(),
        username: faker.person.lastName()
      })
      .expect(201)

    const medias = await prisma.medias.findMany()
    expect(medias).toHaveLength(1)
  })

  it('/medias (POST) same user and title conflict', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: media.title,
        username: media.username
      })
      .expect(409)
  })

  //Get Media

  it('/medias (GET)', async () => {
    await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get('/medias');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1)
  })


  it('/medias/:id (GET)', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get(`/medias/${media.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(media.title)
    expect(response.body.username).toBe(media.username)
  })

  it('/medias/:id (GET) id does not exists', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get(`/medias/${media.id + 1}`);
    expect(response.statusCode).toBe(404);
  })

  //Put Media

  it('/medias/:id (PUT)', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    const newMedia = {
      title: faker.company.name(),
      username: faker.person.firstName()
    }

    let response = await request(app.getHttpServer())
      .put(`/medias/${media.id}`)
      .send(newMedia)
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newMedia.title)
    expect(response.body.username).toBe(newMedia.username)
  })

  it('/medias/:id (PUT) does not exist id', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    const newMedia = {
      title: faker.company.name(),
      username: faker.person.firstName()
    }

    let response = await request(app.getHttpServer())
      .put(`/medias/${media.id + 1}`)
      .send(newMedia)
    expect(response.statusCode).toBe(404)
  })

  it('/medias/:id (PUT) same user and title conflict', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.firstName()
      }
    })

    const mediaPut = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    const newMedia = {
      title: media.title,
      username: media.username
    }

    let response = await request(app.getHttpServer())
      .put(`/medias/${mediaPut.id}`)
      .send(newMedia)
    expect(response.statusCode).toBe(409)
  })

  //Delete Medias

  it('/medias/:id (Delete)', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/medias/${media.id}`)
    expect(response.statusCode).toBe(200);
  })

  it('/medias/:id (Delete) does not exist id', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/medias/${media.id + 1}`)
    expect(response.statusCode).toBe(404);
  })

  it('/medias/:id (Delete) already in a publication', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.company.catchPhrase()
      }
    })

    const publication = await prisma.publications.create({
      data: {
        postId: post.id,
        mediaId: media.id,
        date: new Date(Date.now()).toISOString()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/medias/${media.id}`)
    expect(response.statusCode).toBe(403);
  })



  //POSTS
  //Post Posts

  it('/posts (POST)', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: faker.company.name(),
        text: faker.person.lastName()
      })
      .expect(201)

    const posts = await prisma.posts.findMany()
    expect(posts).toHaveLength(1)
  })

  //Get Posts

  it('/posts (GET)', async () => {
    await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get('/posts');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1)
  })


  it('/posts/:id (GET)', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get(`/posts/${post.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(post.title)
    expect(response.body.text).toBe(post.text)
  })

  it('/post/:id (GET) id does not exists', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer()).get(`/posts/${post.id + 1}`);
    expect(response.statusCode).toBe(404);
  })

  //Put Media

  it('/posts/:id (PUT)', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    const newPost = {
      title: faker.company.name(),
      text: faker.person.firstName()
    }

    let response = await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .send(newPost)
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newPost.title)
    expect(response.body.text).toBe(newPost.text)
  })

  it('/posts/:id (PUT) does not exist id', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    const newPost = {
      title: faker.company.name(),
      text: faker.person.firstName()
    }

    let response = await request(app.getHttpServer())
      .put(`/posts/${post.id + 1}`)
      .send(newPost)
    expect(response.statusCode).toBe(404)
  })

  //Delete Post

  it('/posts/:id (Delete)', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
    expect(response.statusCode).toBe(200);
  })

  it('/post/:id (Delete) does not exist id', async () => {
    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.person.lastName()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/posts/${post.id + 1}`)
    expect(response.statusCode).toBe(404);
  })

  it('/posts/:id (Delete) already in a publication', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.company.catchPhrase()
      }
    })

    const publication = await prisma.publications.create({
      data: {
        postId: post.id,
        mediaId: media.id,
        date: new Date(Date.now()).toISOString()
      }
    })

    let response = await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
    expect(response.statusCode).toBe(403);
  })



  //PUBLICATIONS
  //Post Publications

  it('/publications (POST)', async () => {
    const media = await prisma.medias.create({
      data: {
        title: faker.company.name(),
        username: faker.person.lastName()
      }
    })

    console.log(media)

    const post = await prisma.posts.create({
      data: {
        title: faker.company.name(),
        text: faker.company.catchPhrase()
      }
    })

    console.log(post)

    await request(app.getHttpServer())
    .post('/publications')
    .send({
      mediaId: media.id,
      postId: post.id,
      date: "2030-09-25T15:30:00.000Z"
    })
    .expect(201)
  })
});