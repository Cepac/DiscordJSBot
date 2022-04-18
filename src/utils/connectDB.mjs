import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.JSDBDATABASE, process.env.JSDBUSER, process.env.JSDBPASSWORD, {
    host: process.env.JSDBHOST,
    port: process.env.JSDBPORT,
    dialect: 'mysql',
    logging: false
});

export const connectDB = async ()=> {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
