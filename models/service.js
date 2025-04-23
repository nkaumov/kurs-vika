module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    }, {
      tableName: 'services',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    return Service;
  };
  