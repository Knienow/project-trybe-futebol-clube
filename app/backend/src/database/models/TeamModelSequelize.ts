import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

// Os tipos pré-definidos InferAttributes e InferCreationAttributes servem
// para ajudar o TypeScript a inferir os tipos das colunas no banco de dados
// e dos atributos de criação do modelo, respectivamente. Já o tipo
// CreationOptional serve para definir um tipo opcional durante a criação do modelo.

class TeamModelSequelize extends
  Model<InferAttributes<TeamModelSequelize>, InferCreationAttributes<TeamModelSequelize>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

TeamModelSequelize.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  teamName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'team_name',
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

// OtherModel.belongsTo(Example, { foreignKey: 'campoA', as: 'campoEstrangeiroA' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });

// Example.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

export default TeamModelSequelize;
