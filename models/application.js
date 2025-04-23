module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      master_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('new', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'new',
      },
    }, {
      tableName: 'applications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  
    return Application;
  };
  