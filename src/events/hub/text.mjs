import { VoiceState, Client } from "discord.js";

import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const voice = {
    name: "voiceStateUpdate",
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client
     */
    async execute(oldState, newState, client) {
        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        if (newChannel === oldChannel) return;
        await connectDB();
        const tempChannel = configTempChannelModel(sequelize);

        const newHub = newChannel ? await tempChannel.findOne({ where: { id_channel: newChannel.id } }): null;
        const oldHub = oldChannel ? await tempChannel.findOne({ where: { id_channel: oldChannel.id } }) : null;

        if (newChannel && newHub && !member.user.bot) {
            const newTextHub = await guild.channels.fetch(newHub.id_text_channel);
            if(newTextHub.isThread()){
                await newTextHub.members.add(member);
            } else {
                await newTextHub.permissionOverwrites.create(member, {VIEW_CHANNEL: true});
            }
        }

        if (oldChannel && oldHub && !member.user.bot) {
            const oldTextHub = await guild.channels.fetch(oldHub.id_text_channel);
            if(oldTextHub.isThread()){
                await oldTextHub.members.remove(member.id);
            } else {
                await oldTextHub.permissionOverwrites.delete(member);
            }
        }
    }
}

export default voice;
