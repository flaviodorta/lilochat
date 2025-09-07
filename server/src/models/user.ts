import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare nickname: string;
  declare created_at: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nickname: { type: DataTypes.STRING(40), allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'users', timestamps: false }
);
