'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('rooms', {
      fields: ['current_playlist_item_id'],
      type: 'foreign key',
      name: 'fk_rooms_current_item',
      references: { table: 'room_playlist', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('rooms', 'fk_rooms_current_item');
  },
};
