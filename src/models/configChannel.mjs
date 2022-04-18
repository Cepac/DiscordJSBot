import { Model, DataTypes } from 'sequelize';

export const configChannel = (sequelize) => {
    class ConfigChannel extends Model {}

    ConfigChannel.init({
        id_server: {
            type: DataTypes.STRING(18),
            primaryKey: true,
        },
        id_channel: {
            type: DataTypes.STRING(18),
        },
        category: {
            type: DataTypes.STRING(20),
        },
    }, {
        // options
        sequelize,
        modelName: 'configChannel',
        tableName: 'config_channel',
        underscore: true,
        timestamps: false
        },
    );

    ConfigChannel.removeAttribute('id');
    return ConfigChannel;
}
