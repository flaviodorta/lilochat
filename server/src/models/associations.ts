import { Room } from './room';
import { User } from './user';
import { Video } from './video';
import { Tag } from './tag';
import { RoomPlaylist } from './room-playlist';
import { Message } from './message';

let wired = false;

export function setupAssociations() {
  if (wired) return;

  wired = true;

  Room.belongsTo(User, { as: 'king', foreignKey: 'king_user_id' });
  User.hasOne(Room, { as: 'kingRoom', foreignKey: 'king_user_id' });

  Room.hasMany(RoomPlaylist, {
    as: 'playlist',
    foreignKey: 'room_id',
    onDelete: 'CASCADE',
  });
  RoomPlaylist.belongsTo(Room, { as: 'room', foreignKey: 'room_id' });

  Video.hasMany(RoomPlaylist, { as: 'playlistItems', foreignKey: 'video_id' });
  RoomPlaylist.belongsTo(Video, { as: 'video', foreignKey: 'video_id' });

  Room.belongsTo(RoomPlaylist, {
    as: 'currentItem',
    foreignKey: 'current_playlist_item_id',
  });

  Video.hasMany(Tag, {
    as: 'tags',
    foreignKey: 'video_id',
    onDelete: 'CASCADE',
  });
  Tag.belongsTo(Video, { as: 'video', foreignKey: 'video_id' });

  Room.belongsToMany(Video, {
    through: RoomPlaylist,
    foreignKey: 'room_id',
    otherKey: 'video_id',
  });
  Video.belongsToMany(Room, {
    through: RoomPlaylist,
    as: 'rooms',
    foreignKey: 'video_id',
    otherKey: 'room_id',
  });

  Room.hasMany(Message, {
    as: 'messages',
    foreignKey: 'room_id',
    onDelete: 'CASCADE',
  });
  Message.belongsTo(Room, { as: 'room', foreignKey: 'room_id' });

  User.hasMany(Message, {
    as: 'messages',
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Message.belongsTo(User, { as: 'author', foreignKey: 'user_id' });
}
