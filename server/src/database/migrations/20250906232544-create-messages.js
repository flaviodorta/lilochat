'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER, // ou Sequelize.BIGINT
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      room_id: { type: Sequelize.INTEGER, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      body: { type: Sequelize.TEXT, allowNull: false },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('messages', {
      fields: ['room_id'],
      type: 'foreign key',
      name: 'fk_messages_room',
      references: { table: 'rooms', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('messages', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_messages_user',
      references: { table: 'users', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('messages', ['room_id', 'created_at'], {
      name: 'idx_messages_room_created',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('messages', 'fk_messages_user');
    await queryInterface.removeConstraint('messages', 'fk_messages_room');
    await queryInterface.removeIndex('messages', 'idx_messages_room_created');
    await queryInterface.dropTable('messages');
  },
};
