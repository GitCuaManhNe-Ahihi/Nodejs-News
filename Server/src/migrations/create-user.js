'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      password:{
          type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      address:{
        type: Sequelize.STRING
      },
      phoneNumber:{
        type: Sequelize.STRING
      },
      birthDay:{
        type: Sequelize.DATE
      },
      image:{
        type: Sequelize.STRING,
      },
      gender:{
        type: Sequelize.BOOLEAN,
        defaultValue:1
      },
      admin:{
        type:Sequelize.BOOLEAN,
        defaultValue:0
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};