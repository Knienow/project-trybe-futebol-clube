import TeamModelSequelize from '../database/models/TeamModelSequelize';
import ITeam from '../Interfaces/ITeam';
import { ITeamModel } from '../Interfaces/ITeamModel';
// import { NewEntity } from '../Interfaces';

export default class TeamModel implements ITeamModel {
  private model = TeamModelSequelize;

  async findById(id: ITeam['id']): Promise<ITeam | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;
    const { teamName }: ITeam = dbData;
    return { id, teamName };
  }

  async findAll(): Promise<ITeam[]> {
    const dbData = await this.model.findAll();
    return dbData.map(({ id, teamName }) => (
      { id, teamName }
    ));
  }

  // async create(data: NewEntity<ITeam>): Promise<ITeam> {
  //   const dbData = await this.model.create(data);
  //   const { id, teamName }: ITeam = dbData;
  //   return { id, teamName };
  // }

  // async update(id: ITeam['id'], data: Partial<NewEntity<ITeam>>): Promise<ITeam | null> {
  //   const [affectedRows] = await this.model.update(data, { where: { id } });
  //   if (affectedRows === 0) return null;

  //   return this.findById(id);
  // }

  // async delete(id: ITeam['id']): Promise<number> {
  //   return this.model.destroy({ where: { id } });
  // }
}
