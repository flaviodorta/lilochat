import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export class Room extends Model<
  InferAttributes<Room>,
  InferCreationAttributes<Room>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare king_user_id: string | null; // rei atual (dinâmico)
  declare current_playlist_item_id: string | null; // item “tocando agora”
  declare created_at: CreationOptional<Date>;
}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    king_user_id: { type: DataTypes.UUID, allowNull: true },
    current_playlist_item_id: { type: DataTypes.UUID, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'rooms', timestamps: false }
);
