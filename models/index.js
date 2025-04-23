const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Подключение к БД
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Тест подключения
sequelize.authenticate()
  .then(() => console.log('✅ Успешное подключение к базе данных'))
  .catch(err => console.error('❌ Ошибка подключения к БД:', err));

// Объект моделей
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Инициализация моделей
db.Service = require('./service')(sequelize, DataTypes);
db.Master = require('./master')(sequelize, DataTypes);
db.AppointmentSlot = require('./appointmentSlot')(sequelize, DataTypes);
db.Application = require('./application')(sequelize, DataTypes);

db.Manager = require('./manager')(sequelize, DataTypes); // ✅ ВАЖНО


// Связи между моделями
db.Master.hasMany(db.AppointmentSlot, { foreignKey: 'master_id' });
db.AppointmentSlot.belongsTo(db.Master, { foreignKey: 'master_id' });

db.Service.hasMany(db.Application, { foreignKey: 'service_id' });
db.Master.hasMany(db.Application, { foreignKey: 'master_id' });
db.AppointmentSlot.hasOne(db.Application, { foreignKey: 'slot_id' });

db.Application.belongsTo(db.Service, { foreignKey: 'service_id' });
db.Application.belongsTo(db.Master, { foreignKey: 'master_id' });
db.Application.belongsTo(db.AppointmentSlot, { foreignKey: 'slot_id' });

module.exports = db;
