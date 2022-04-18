import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const voice = {
    name: "channelUpdate",
    async execute(oldChannel, newChannel, client) {
        await connectDB();
        const tempChannel = configTempChannelModel(sequelize);

        if (newChannel.type !== 'GUILD_VOICE' && oldChannel.type !== 'GUILD_VOICE') return;
        if (newChannel.name === oldChannel.name) return;

        const guild = await client.guilds.fetch(client.settings.mainGuild);
        const newHub = newChannel ? await tempChannel.findOne({ where: { id_channel: newChannel.id } }): null;
        const oldHub = oldChannel ? await tempChannel.findOne({ where: { id_channel: oldChannel.id } }) : null;

        if (newHub && oldHub) {
            const textChannel = await guild.channels.fetch(newHub.id_text_channel);
            await textChannel.setName('Sin micro de ' + newChannel.name);
        }
    }
}

export default voice;
