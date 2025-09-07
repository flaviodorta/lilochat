'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.INTEGER, // ou Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(120), allowNull: false },
      king_user_id: { type: Sequelize.INTEGER, allowNull: true },
      current_playlist_item_id: { type: Sequelize.INTEGER, allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('rooms', {
      fields: ['king_user_id'],
      type: 'foreign key',
      name: 'fk_rooms_king_user',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('rooms', ['king_user_id'], {
      name: 'uniq_rooms_king_user',
      unique: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('rooms', 'uniq_rooms_king_user');
    await queryInterface.removeConstraint('rooms', 'fk_rooms_king_user');
    await queryInterface.dropTable('rooms');
  },
};
