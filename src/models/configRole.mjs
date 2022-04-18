import { Model, DataTypes } from 'sequelize';

export const configRole = (sequelize) => {
    class ConfigRole extends Model {}

    ConfigRole.init({
        id_server: {
            type: DataTypes.STRING(18),
            primaryKey: true,
        },
        id_role: {
            type: DataTypes.STRING(18),
        },
        category: {
            type: DataTypes.STRING(20),
        },
    }, {
        // options
        sequelize,
        modelName: 'ConfigRole',
        tableName: 'config_roles',
        underscore: true,
        timestamps: false
        },
    );

    ConfigRole.removeAttribute('id');
    return ConfigRole;
}
