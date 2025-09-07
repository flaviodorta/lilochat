'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('room_playlist', {
      id: {
        type: Sequelize.INTEGER, // ou Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      room_id: { type: Sequelize.INTEGER, allowNull: false },
      video_id: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.ENUM('queued', 'playing', 'paused'),
        allowNull: false,
        defaultValue: 'queued',
      },
      started_at: { type: Sequelize.DATE, allowNull: false },
      base_time_seconds: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('room_playlist', {
      fields: ['room_id'],
      type: 'foreign key',
      name: 'fk_room_playlist_room',
      references: { table: 'rooms', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('room_playlist', {
      fields: ['video_id'],
      type: 'foreign key',
      name: 'fk_room_playlist_video',
      references: { table: 'videos', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addIndex('room_playlist', ['room_id', 'created_at'], {
      name: 'idx_room_playlist_room_created',
    });
    await queryInterface.addIndex('room_playlist', ['room_id', 'status'], {
      name: 'idx_room_playlist_room_status',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('room_playlist'); // ENUM cai junto no MySQL
  },
};
