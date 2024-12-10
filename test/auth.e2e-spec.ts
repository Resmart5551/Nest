import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
	login: "vvv@gmail.com",
	password: '12345'
}

const failLoginDto: AuthDto = {
	login: "vvvv2@gmail.com",
	password: '12345'
}

const failPasswordDto: AuthDto = {
	login: "vvv@gmail.com",
	password: '123456'
}

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST)-success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
	});

	it('/auth/login (POST)-fail login', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(failLoginDto)
			.expect(401)
	});

	it('/auth/login (POST)-fail login', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(failPasswordDto)
			.expect(401)
	});

	afterAll(async () => {
		await disconnect();
		await app.close();
	});
});
