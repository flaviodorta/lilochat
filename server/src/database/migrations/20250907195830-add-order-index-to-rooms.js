'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rooms', 'order_index', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // ---------- Escolha UMA das duas formas de backfill ----------

    // Forma A (MySQL 8+ com janela):
    // await queryInterface.sequelize.query(`
    //   UPDATE rooms r
    //   JOIN (
    //     SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS rn
    //     FROM rooms
    //   ) s ON s.id = r.id
    //   SET r.order_index = s.rn
    // `);

    // Forma B (MySQL 5.7/8, sem múltiplas statements):
    await queryInterface.sequelize.query('SET @rn := 0');
    await queryInterface.sequelize.query(`
      UPDATE rooms r
      JOIN (
        SELECT id, (@rn := @rn + 1) AS rn
        FROM (SELECT id FROM rooms ORDER BY created_at, id) AS ordered
      ) s ON s.id = r.id
      SET r.order_index = s.rn
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE rooms
        MODIFY order_index INT NOT NULL,
        ADD UNIQUE KEY uq_rooms_order_index (order_index)
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE rooms DROP INDEX uq_rooms_order_index
    `);
    await queryInterface.removeColumn('rooms', 'order_index');
  },
};
