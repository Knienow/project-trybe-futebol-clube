import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../../src/app';
import MatchModelSequelize from '../database/models/MatchModelSequelize';
import { matches, match1 } from './mocks/Match.mock';
import JWT from '../utils/JWT';
import validateToken from '../middlewares/Validations';
import mapStatusHTTP from '../utils/mapStatusHTTP';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Matches Test', function() {
  beforeEach(() => {
    sinon.restore();
  }); 
  it('should return all matches', async function() {
    sinon.stub(MatchModelSequelize, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    expect(body).to.deep.equal(matches);
  });

  it('list inProgress=true Matches', async function() {
    sinon.stub(MatchModelSequelize, 'findAll').resolves([]);
    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    // expect(body).to.deep.equal(matches);
  });

  it('list inProgress=false Matches', async function() {
    sinon.stub(MatchModelSequelize, 'findAll').resolves([]);
    const { status, body } = await chai.request(app).get('/matches?inProgress=false');

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    // expect(body).to.deep.equal(matches);
  });

  it('create Match', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'create').resolves({} as any);
    const { status } = await chai.request(app).post('/matches')
      .set(
        'authorization', 
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 2,
        awayTeamId: 4,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('CREATED'));
    // expect(body).to.deep.equal(matches);
  });

  it('update Match', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'update').resolves({} as any);
    const { status } = await chai.request(app).patch('/matches/43')
      .set(
        'authorization', 
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 11,
        awayTeamId: 10,
        homeTeamGoals: 2,
        awayTeamGoals: 1,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    // expect(body).to.deep.equal(matches);
  });

  it('finish Match', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'update').resolves({} as any);
    const { status } = await chai.request(app).patch('/matches/43/finish')
      .set(
        'authorization', 
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 11,
        awayTeamId: 10,
        homeTeamGoals: 2,
        awayTeamGoals: 1,
        inProgress: false,
      });

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    // expect(body).to.deep.equal(matches);
  });

  it('create Match without second team - fail', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'create').resolves({} as any);
    const { status } = await chai.request(app).post('/matches')
      .set(
        'authorization', 
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('NOT_FOUND'));
    // expect(body).to.deep.equal(matches);
  });

  it('create Match with same id team - fail', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'create').resolves({} as any);
    const { status } = await chai.request(app).post('/matches')
      .set(
        'authorization', 
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 2,
        awayTeamId: 2,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('UNPROCESSABLE ENTITY'));
    // expect(body).to.deep.equal(matches);
  });

  it('test token empty', async function() {
    sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'create').resolves({} as any);
    const { status } = await chai.request(app).post('/matches')
      .set(
        'authorization', 
        '',
      )
      .send({
        homeTeamId: 2,
        awayTeamId: 4,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('UNAUTHORIZED'));
    // expect(body).to.deep.equal(matches);
  });

  it('test invalid token', async function() {
    // sinon.stub(JWT, 'verify').returns({ email: 'admin@admin.com' } as any);
    sinon.stub(MatchModelSequelize, 'create').resolves({} as any);
    sinon.stub(validateToken, 'validateToken');
    const { status } = await chai.request(app).post('/matches')
      .set(
        'authorization', 
        'Bearer eyJhbDdiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY5NDQ4MDIwOCwiZXhwIjoxNjk1MzQ0MjA4fQ.3LSbvnUQAtsXF9tkosy61lKrBrB4LNjTHtLZXRTZ1ck'
      )
      .send({
        homeTeamId: 2,
        awayTeamId: 4,
        homeTeamGoals: 0,
        awayTeamGoals: 0,
        inProgress: true,
      });

    expect(status).to.equal(mapStatusHTTP('UNAUTHORIZED'));
    // expect(body).to.deep.equal(matches);
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
});