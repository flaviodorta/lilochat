'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videos', {
      id: {
        type: Sequelize.INTEGER, // ou Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      video_id: { type: Sequelize.STRING(32), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      thumbnail_url: { type: Sequelize.STRING(2048), allowNull: false },
      video_url: { type: Sequelize.STRING(2048), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('videos', ['video_id'], {
      name: 'idx_videos_video_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('videos', 'idx_videos_video_id');
    await queryInterface.dropTable('videos');
  },
};
