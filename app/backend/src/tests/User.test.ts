import * as sinon from 'sinon';
import * as chai from 'chai';
import { App } from '../../src/app';
import { user } from './mocks/User.mock';
import JWT from '../../src/utils/JWT';
import validateLogin from '../../src/middlewares/Validations';
import mapStatusHTTP from '../utils/mapStatusHTTP';

// @ts-ignore
import chaiHttp = require('chai-http');

import UserModelSequelize from '../../src/database/models/UserModelSequelize';
    
chai.use(chaiHttp);

const { expect } = chai;

const { app } = new App();

describe('Users Test', function() {
  beforeEach(() => {
    sinon.restore();
  }); 

  it('valid login', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    sinon.stub(JWT, 'sign').returns(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
    );

    const { status, body } = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'secret_admin',
    });

    expect(status).to.equal(200);
    // expect(body).to.deep.equal(users);
  });

  it('login - invalid email', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    
    const { status, body } = await chai.request(app).post('/login').send({
      email: 'admin@admin',
      password: 'secret_admin',
    });

    expect(status).to.equal(401);
    // expect(body).to.deep.equal(users);
  });

  it('login - invalid password', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    
    const { status, body } = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'dodozinha',
    });

    expect(status).to.equal(401);
    // expect(body).to.deep.equal(users);
  });


  it('login - password with length < 6', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    sinon.stub(validateLogin, 'validateLogin').returns({} as any);

    const { status, body } = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: 'sec',
    });

    expect(status).to.equal(401);
    // expect(body).to.deep.equal(users);
  });


  it('login - email empty', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    sinon.stub(validateLogin, 'validateLogin').returns({} as any);

    const { status, body } = await chai.request(app).post('/login').send({
      email: '',
      password: 'secret_admin',
    });

    expect(status).to.equal(400);
    // expect(body).to.deep.equal(users);
  });

  it('login - password empty', async function() {
    sinon.stub(UserModelSequelize, 'findOne').resolves(user as any);
    sinon.stub(validateLogin, 'validateLogin').returns({} as any);

    const { status, body } = await chai.request(app).post('/login').send({
      email: 'admin@admin.com',
      password: '',
    });

    expect(status).to.equal(mapStatusHTTP('INVALID_DATA'));
    // expect(body).to.deep.equal(users);
  });

   // it('should return a user by id', async function() {
  //   sinon.stub(UserModelSequelize, 'findByPk').resolves(userWithoutPassword as any);

  //   const { status, body } = await chai.request(app).get('/users/1');

  //   expect(status).to.equal(200);
  //   expect(body).to.deep.equal(userWithoutPassword);
  // });

  // it('should return a message when user is not found', async function() {
  //   sinon.stub(UserModelSequelize, 'findByPk').resolves(null);

  //   const { status, body } = await chai.request(app).get('/users/1');

  //   expect(status).to.equal(404);
  //   expect(body.message).to.equal('User not found');
  // });

  // it('shouldn\'t login with an invalid body data', async function() {
  //   const { status, body } = await chai.request(app).post('/users/login')
  //     .send({});

  //   expect(status).to.equal(400);
  //   expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  // });

  // it('shouldn\'t login with an invalid email', async function() {
  //   const { status, body } = await chai.request(app).post('/users/login')
  //     .send(invalidEmailLoginBody);

  //   expect(status).to.equal(401);
  //   expect(body).to.be.deep.equal({ message: 'Invalid email' });
  // });

  // it('shouldn\'t login with an invalid password', async function() {
  //   const { status, body } = await chai.request(app).post('/users/login')
  //     .send(invalidPasswordLoginBody);

  //   expect(status).to.equal(401);
  //   expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  // });

  // it('shouldn\'t login when user is not found', async function() {
  //   sinon.stub(UserModelSequelize, 'findOne').resolves(null);

  //   const { status, body } = await chai.request(app)
  //     .post('/users/login')
  //     .send(validLoginBody);
  //   expect(status).to.equal(404);
  //   expect(body).to.be.deep.equal({ message: 'User not found' });
  // });

  // it('should return a token when login is done', async function() {
  //   sinon.stub(UserModelSequelize, 'findOne').resolves(userRegistered as any);
  //   sinon.stub(JWT, 'sign').returns('validToken');
  //   sinon.stub(Validations, 'validateLogin').returns();

  //   const { status, body } = await chai.request(app)
  //     .post('/users/login')
  //     .send(validLoginBody);

  //   expect(status).to.equal(200);
  //   expect(body).to.have.key('token');
  // });

  // it('should return invalid data when user password is wrong', async function() {
  //   sinon.stub(UserModelSequelize, 'findOne').resolves(wrongPassUser as any);
  //   sinon.stub(JWT, 'sign').returns('validToken');
  //   sinon.stub(Validations, 'validateLogin').returns();

  //   const { status, body } = await chai.request(app)
  //     .post('/users/login')
  //     .send(validLoginBody);

  //   expect(status).to.equal(400);
  //   expect(body.message).to.equal('Invalid email or password');
  // });

  // afterEach(sinon.restore);
});