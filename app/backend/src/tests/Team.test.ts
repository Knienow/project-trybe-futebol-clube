// tests/integration/Book.test.ts

import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../../src/app';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import { team1, team2, team3, teams } from '../tests/mocks/Team.mock';
import Validations from '../middlewares/ValidationTeams';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teams Test', function() {
  it('should create a team', async function() {
    sinon.stub(TeamModelSequelize, 'create').resolves(team1 as any);
    sinon.stub(Validations, 'validateTeam').returns();

    const { id, ...sendData } = team1;

    const { status, body } = await chai.request(app).post('/teams')
      .send(sendData);

    expect(status).to.equal(201);
    expect(body).to.deep.equal(team1);
  });

  it('shouldn\'t create a team with invalid body data', async function() {
    const { status, body } = await chai.request(app).post('/teams')
      .send({});

    expect(status).to.equal(400);
    expect(body.message).to.equal('teamName is required');
  });
  afterEach(sinon.restore);

  it('should return all teams', async function() {
    sinon.stub(TeamModelSequelize, 'findAll').resolves(teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('should return a team by id', async function() {
    sinon.stub(TeamModelSequelize, 'findOne').resolves(team1 as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team1);
  });

  it('should return not found if the team doesn\'t exists', async function() {
    sinon.stub(TeamModelSequelize, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team 1 not found');
  });

  it('should update a team', async function () {
    sinon.stub(TeamModelSequelize, 'update').resolves([1] as any);
    sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);
    sinon.stub(Validations, 'validateTeam').returns();

    const { id, ...sendData } = team1;

    const { status, body } = await chai.request(app).put('/teams/1')
      .send(sendData);

    expect(status).to.equal(200);
    expect(body.message).to.equal('Team updated');
  });

  it('should return not found when the team to update does not exists', async function () {
    sinon.stub(TeamModelSequelize, 'findByPk').resolves(null);

    const { id, ...sendData } = team1;

    const { status, body } = await chai.request(app).put('/teams/1')
      .send(sendData);

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team 1 not found');
  });

  it('should return conflict when there is nothing to be updated', async function () {
    sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);
    sinon.stub(TeamModelSequelize, 'update').resolves([0] as any);

    const { id, ...sendData } = team1;

    const { status, body } = await chai.request(app).put('/teams/1')
      .send(sendData);

    expect(status).to.equal(409);
    expect(body.message).to.equal('There are no updates to perform in Team 1');
  });

  it('should delete a team', async function() {
    sinon.stub(TeamModelSequelize, 'destroy').resolves();
    sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);

    const { status, body } = await chai
      .request(app)
      .delete('/teams/1');

    expect(status).to.equal(200);
    expect(body.message).to.equal('Team deleted');
  });

  it('should return not found when the team to delete does not exists', async function() {
    sinon.stub(TeamModelSequelize, 'findByPk').resolves(null);

    const { status, body } = await chai
      .request(app)
      .delete('/teams/1')

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team 1 not found');
  });
});