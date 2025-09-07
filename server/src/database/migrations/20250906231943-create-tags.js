'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER, // ou Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      video_id: { type: Sequelize.INTEGER, allowNull: false },
      name: { type: Sequelize.STRING(64), allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('tags', {
      fields: ['video_id'],
      type: 'foreign key',
      name: 'fk_tags_video',
      references: { table: 'videos', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('tags', {
      fields: ['video_id', 'name'],
      type: 'unique',
      name: 'uniq_tags_video_name',
    });

    await queryInterface.addIndex('tags', ['video_id'], {
      name: 'idx_tags_video',
    });
    await queryInterface.addIndex('tags', ['name'], { name: 'idx_tags_name' });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('tags', 'fk_tags_video');
    await queryInterface.removeConstraint('tags', 'uniq_tags_video_name');
    await queryInterface.removeIndex('tags', 'idx_tags_name');
    await queryInterface.removeIndex('tags', 'idx_tags_video');
    await queryInterface.dropTable('tags');
  },
};
