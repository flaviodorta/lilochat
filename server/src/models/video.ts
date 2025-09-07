import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export class Video extends Model<
  InferAttributes<Video>,
  InferCreationAttributes<Video>
> {
  declare id: CreationOptional<string>;
  declare video_id: string; // YouTube ID
  declare title: string;
  declare description: string;
  declare thumbnail_url: string;
  declare video_url: string;
  declare created_at: CreationOptional<Date>;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    video_id: { type: DataTypes.STRING(32), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    thumbnail_url: { type: DataTypes.STRING(2048), allowNull: false },
    video_url: { type: DataTypes.STRING(2048), allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'videos', timestamps: false }
);
