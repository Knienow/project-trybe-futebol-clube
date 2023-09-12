import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../../src/app';
import MatchModelSequelize from '../database/models/MatchModelSequelize';
import { matches, match1 } from './mocks/Match.mock';
import Validations from '../middlewares/ValidationTeams';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Matches Test', function() {
  // it('should create a team', async function() {
  //   sinon.stub(TeamModelSequelize, 'create').resolves(team1 as any);
  //   sinon.stub(Validations, 'validateTeam').returns();

  //   const { id, ...sendData } = team1;

  //   const { status, body } = await chai.request(app).post('/teams')
  //     .send(sendData);

  //   expect(status).to.equal(201);
  //   expect(body).to.deep.equal(team1);
  // });

  // it('shouldn\'t create a team with invalid body data', async function() {
  //   const { status, body } = await chai.request(app).post('/teams')
  //     .send({});

  //   expect(status).to.equal(400);
  //   expect(body.message).to.equal('teamName is required');
  // });
  // afterEach(sinon.restore);

  it('should return all matches', async function() {
    sinon.stub(MatchModelSequelize, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  it('should return a match by id', async function() {
    sinon.stub(MatchModelSequelize, 'findOne').resolves(match1 as any);

    const { status, body } = await chai.request(app).get('/matches/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(match1);
  });

  it('should return not found if the match doesn\'t exists', async function() {
    sinon.stub(MatchModelSequelize, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/matches/1');

    expect(status).to.equal(404);
    expect(body.message).to.equal('Match 1 not found');
  });

  // it('should update a team', async function () {
  //   sinon.stub(TeamModelSequelize, 'update').resolves([1] as any);
  //   sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);
  //   sinon.stub(Validations, 'validateTeam').returns();

  //   const { id, ...sendData } = team1;

  //   const { status, body } = await chai.request(app).put('/teams/1')
  //     .send(sendData);

  //   expect(status).to.equal(200);
  //   expect(body.message).to.equal('Team updated');
  // });

  // it('should return not found when the team to update does not exists', async function () {
  //   sinon.stub(TeamModelSequelize, 'findByPk').resolves(null);

  //   const { id, ...sendData } = team1;

  //   const { status, body } = await chai.request(app).put('/teams/1')
  //     .send(sendData);

  //   expect(status).to.equal(404);
  //   expect(body.message).to.equal('Team 1 not found');
  // });

  // it('should return conflict when there is nothing to be updated', async function () {
  //   sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);
  //   sinon.stub(TeamModelSequelize, 'update').resolves([0] as any);

  //   const { id, ...sendData } = team1;

  //   const { status, body } = await chai.request(app).put('/teams/1')
  //     .send(sendData);

  //   expect(status).to.equal(409);
  //   expect(body.message).to.equal('There are no updates to perform in Team 1');
  // });

  // it('should delete a team', async function() {
  //   sinon.stub(TeamModelSequelize, 'destroy').resolves();
  //   sinon.stub(TeamModelSequelize, 'findByPk').resolves(team1 as any);

  //   const { status, body } = await chai
  //     .request(app)
  //     .delete('/teams/1');

  //   expect(status).to.equal(200);
  //   expect(body.message).to.equal('Team deleted');
  // });

  // it('should return not found when the team to delete does not exists', async function() {
  //   sinon.stub(TeamModelSequelize, 'findByPk').resolves(null);

  //   const { status, body } = await chai
  //     .request(app)
  //     .delete('/teams/1')

  //   expect(status).to.equal(404);
  //   expect(body.message).to.equal('Team 1 not found');
  // });
});