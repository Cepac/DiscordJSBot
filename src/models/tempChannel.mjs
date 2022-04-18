import { Model, DataTypes } from 'sequelize';

export const tempChannel = (sequelize) => {
    class TempChannel extends Model {}

    TempChannel.init({
        id: {
            type: DataTypes.INTEGER(6),
            autoIncrement: true,
            primaryKey: true,
        },
        id_user: DataTypes.STRING(18),
        id_channel: DataTypes.STRING(18),
        id_text_channel: DataTypes.STRING(18),
    }, {
        sequelize,
        modelName: 'tempChannel',
        tableName: 'temp_channel',
        underscore: true,
        timestamps: false
        },
    );

    return TempChannel;
}
