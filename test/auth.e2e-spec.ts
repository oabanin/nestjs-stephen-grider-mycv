import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup-app';

describe('Auth system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app); //NOT the best way to connect
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const emailRegister = 'hshggdsuf@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: emailRegister,
        password: 'asdasfsfs1s',
      })
      .expect(201)
      .expect((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(emailRegister);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'sds@sdsd.sdsd';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '1234566' })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
