const { v4: uuidv4 } = require('uuid')
module.exports = (sequelize, DataTypes) => {
    const Form = sequelize.define(
        'Form',
        {
            Id: {
                type: DataTypes.UUID,
                defaultValue: () => uuidv4(),
                primaryKey: true,
                field: "Id"
            },
            Date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            shop_no: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            allocation: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },
        {
            tableName: 'form',
            timestamps: true
        }
    );

    return Form
}