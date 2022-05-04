"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Genres", [
      {
        name: "ALL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tin Tức",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kinh tế",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sức khỏe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Công nghệ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lịch sử",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Thể thao",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Giải trí",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Genres", null, {});
  },
};
