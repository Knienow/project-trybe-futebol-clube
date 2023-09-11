import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import TeamModelSequelize from './TeamModelSequelize';

class MatchModelSequelize extends Model
  <InferAttributes<MatchModelSequelize>,
  InferCreationAttributes<MatchModelSequelize>> {
  declare id: CreationOptional<number>;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchModelSequelize.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

MatchModelSequelize.belongsTo(TeamModelSequelize, { foreignKey: 'homeTeamId', as: 'homeTeam' });
MatchModelSequelize.belongsTo(TeamModelSequelize, { foreignKey: 'awayTeamId', as: 'awayTeam' });

TeamModelSequelize.hasMany(MatchModelSequelize, { foreignKey: 'homeTeamId' });
TeamModelSequelize.hasMany(MatchModelSequelize, { foreignKey: 'awayTeamId' });

export default MatchModelSequelize;
