import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import sequelize from '../database/index';

export class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare id: CreationOptional<string>;
  declare room_id: string;
  declare user_id: string;
  declare body: string;
  declare created_at: CreationOptional<Date>;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER, // ou DataTypes.BIGINT se quiser 64 bits
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    room_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: 'messages', timestamps: false }
);
