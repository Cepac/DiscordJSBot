import { Model, DataTypes } from 'sequelize';

export const modules = (sequelize) => {
    class Modules extends Model {}

    Modules.init({
        id: {
            type: DataTypes.INTEGER(6),
            autoIncrement: true,
            primaryKey: true,
        },
        id_server: DataTypes.STRING(18),
        name: DataTypes.STRING(18),
        status: DataTypes.STRING(3),
    }, {
        // options
        sequelize,
        modelName: 'modules',
        tableName: 'modules',
        underscore: true,
        timestamps: false
        },
    );

    Modules.removeAttribute('id');
    return Modules;
}
