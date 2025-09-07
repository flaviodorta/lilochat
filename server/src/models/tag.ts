import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export class Tag extends Model<
  InferAttributes<Tag>,
  InferCreationAttributes<Tag>
> {
  declare id: CreationOptional<string>;
  declare video_id: string;
  declare name: string;
  declare created_at: CreationOptional<Date>;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    video_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING(64), allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'tags', timestamps: false }
);
