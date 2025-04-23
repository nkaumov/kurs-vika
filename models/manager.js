module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define('Manager', {
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
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'managers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    return Manager;
  };
  