import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({
      userId: '297fdcc1-be5d-474a-bf9l-bb0c40434281',
      email: 'conrinomorillo@email.com',
      roles: ['admin'],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get /users/ returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
    // console.log(req.body);
  });

  it('Get /users/:id returns object of user', async () => {
    const req = await request(app.getHttpServer())
      .get('/users/297fdcc1-be5d-474f-bf9b-bb0c40434281')
      .set('Authorization', `Bearer ${token}`);
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Object);
    console.log(req.body);
  });
});
