import { Client, SelectMenuInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const event = {
  name: 'interactionCreate',
  /**
   *
   * @param {SelectMenuInteraction} interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;
    const { channel, member, guild } = interaction;
    await connectDB();
    const tempChannel = configTempChannelModel(sequelize);
    const response = new MessageEmbed()

    const isOwner = await tempChannel.findOne({ where: { id_text_channel: channel.id} });
    if(isOwner && member.id !== isOwner.id_user){
        response.setColor("RED")
        response.setDescription("⚠️ No tienes permiso para realizar esa acción ⚠️")
        
        return interaction.reply({embeds: [response], ephemeral: true});
    } else if (!isOwner) {
        return;
    }

    if (interaction.customId === "newRegion") {
        const voiceChannel = await guild.channels.fetch(isOwner.id_channel);
        if(voiceChannel.rtcRegion === interaction.values[0]){
            return await interaction.update({ content: 'La región seleccionada ya estaba aplicada', components: [], ephemeral: true });
        } else {
            response.setColor("GREEN")
            response.setDescription(`✅ <@${interaction.user.id}> ha cambiado la región del canal a ${interaction.values[0]}`)

            await voiceChannel.setRTCRegion(interaction.values[0])

            await channel.send({ embeds: [response] });
            return await interaction.update({ content:`Se ha cambiado la región a ${interaction.values[0]}`, components: [], ephemeral: true });
        }
    }
  }
};

export default event;