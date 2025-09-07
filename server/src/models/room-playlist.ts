import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export type PlaylistStatus = 'queued' | 'playing' | 'paused';

export class RoomPlaylist extends Model<
  InferAttributes<RoomPlaylist>,
  InferCreationAttributes<RoomPlaylist>
> {
  declare id: CreationOptional<string>;
  declare room_id: string;
  declare video_id: string;
  declare status: PlaylistStatus;
  declare started_at: Date; // quando começou a tocar
  declare base_time_seconds: number; // offset/seek base
  declare created_at: CreationOptional<Date>;
}

RoomPlaylist.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    room_id: { type: DataTypes.UUID, allowNull: false },
    video_id: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.ENUM('queued', 'playing', 'paused'),
      allowNull: false,
      defaultValue: 'queued',
    },
    started_at: { type: DataTypes.DATE, allowNull: false },
    base_time_seconds: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'room_playlist', timestamps: false }
);
