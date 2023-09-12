import * as sinon from 'sinon';
import * as chai from 'chai';
import { App } from '../../src/app';
import { users, user, invalidEmailLoginBody, invalidPasswordLoginBody,
    validLoginBody, wrongPassUser, userRegistered, userWithoutPassword } from './mocks/User.mock';
import JWT from '../../src/utils/JWT';
import Validations from '../../src/middlewares/Validations';

// @ts-ignore
import chaiHttp = require('chai-http');

import SequelizeUser from '../../src/database/models/UserModelSequelize';
    
chai.use(chaiHttp);

const { expect } = chai;

const { app } = new App();

describe('Users Test', function() {
  it('should return all users', async function() {
    sinon.stub(SequelizeUser, 'findAll').resolves(users as any);

    const { status, body } = await chai.request(app).get('/users');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(users);
  });

  it('should return a user by id', async function() {
    sinon.stub(SequelizeUser, 'findByPk').resolves(userWithoutPassword as any);

    const { status, body } = await chai.request(app).get('/users/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(userWithoutPassword);
  });

  it('should return a message when user is not found', async function() {
    sinon.stub(SequelizeUser, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app).get('/users/1');

    expect(status).to.equal(404);
    expect(body.message).to.equal('User not found');
  });

  it('shouldn\'t login with an invalid body data', async function() {
    const { status, body } = await chai.request(app).post('/users/login')
      .send({});

    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('shouldn\'t login with an invalid email', async function() {
    const { status, body } = await chai.request(app).post('/users/login')
      .send(invalidEmailLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email' });
  });

  it('shouldn\'t login with an invalid password', async function() {
    const { status, body } = await chai.request(app).post('/users/login')
      .send(invalidPasswordLoginBody);

    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('shouldn\'t login when user is not found', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    const { status, body } = await chai.request(app)
      .post('/users/login')
      .send(validLoginBody);
    expect(status).to.equal(404);
    expect(body).to.be.deep.equal({ message: 'User not found' });
  });

  it('should return a token when login is done', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(userRegistered as any);
    sinon.stub(JWT, 'sign').returns('validToken');
    sinon.stub(Validations, 'validateLogin').returns();

    const { status, body } = await chai.request(app)
      .post('/users/login')
      .send(validLoginBody);

    expect(status).to.equal(200);
    expect(body).to.have.key('token');
  });

  it('should return invalid data when user password is wrong', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(wrongPassUser as any);
    sinon.stub(JWT, 'sign').returns('validToken');
    sinon.stub(Validations, 'validateLogin').returns();

    const { status, body } = await chai.request(app)
      .post('/users/login')
      .send(validLoginBody);

    expect(status).to.equal(400);
    expect(body.message).to.equal('Invalid email or password');
  });

  afterEach(sinon.restore);
});