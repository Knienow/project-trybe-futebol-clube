import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../../src/app';
import JWT from '../utils/JWT';
import validateToken from '../middlewares/Validations';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamModelSequelize from '../database/models/TeamModelSequelize';
import MatchModelSequelize from '../database/models/MatchModelSequelize';
import { teams } from './mocks/Team.mock';
import { matches } from './mocks/Match.mock';
import { leaderboard } from './mocks/Learderboard.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Leaderboard Test', function() {
  beforeEach(() => {
    sinon.restore();
  }); 
  it('should return all teams', async function() {
    sinon.stub(TeamModelSequelize, 'findAll').resolves(teams as any);
    sinon.stub(MatchModelSequelize, 'findAll').resolves(leaderboard as any);

    const { status, body } = await chai.request(app).get('/leaderboard/home');

    expect(status).to.equal(mapStatusHTTP('SUCCESSFUL'));
    // expect(body).to.deep.equal(leaderboard);
  });
});