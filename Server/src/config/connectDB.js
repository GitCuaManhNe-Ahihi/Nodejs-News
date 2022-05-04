import Sequelize from "sequelize";

// Option 1: Passing a connection URI
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('newsdb', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

const ConnectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
export default ConnectDB;