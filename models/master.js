module.exports = (sequelize, DataTypes) => {
    const Master = sequelize.define('Master', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      service_category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    }, {
      tableName: 'masters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  
    return Master;
  };
  