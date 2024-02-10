const { Sequelize, DataTypes } = require('sequelize');

// Replace 'your_database_name', 'your_username', 'your_password', and 'your_host' with your actual MySQL database credentials
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'your_host',
  dialect: 'mysql',
  dialectModule: require('mysql'), // Use the 'mysql' library
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  symbol_number: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(18),
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('User model synced with database');
  })
  .catch((err) => {
    console.error('Error syncing User model:', err);
  });

module.exports = User;
