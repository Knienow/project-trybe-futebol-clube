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
  it('should return all matches', async function() {
    sinon.stub(MatchModelSequelize, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  });

  it('test route GET /match?inProgress=true - SUCESSFULL', () => {
    sinon.stub(MatchModelSequelize, 'findAll').resolves(match1 as any); 
    
      it('should return a list of one match with a 200 status code', async () => {
        const response = await chai.request(app).get('/matches?inProgress=true');

        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.equal(1);
        expect(response.status).to.be.equal(200);
      });
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