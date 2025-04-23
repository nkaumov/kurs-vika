module.exports = (sequelize, DataTypes) => {
    const AppointmentSlot = sequelize.define('AppointmentSlot', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('available', 'booked'),
        defaultValue: 'available',
      },
    }, {
      tableName: 'appointment_slots',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  
    return AppointmentSlot;
  };
  