import { Client, MessageEmbed } from 'discord.js';
import { ModalSubmitInteraction } from 'discord-modals';
import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const event = {
  name: 'modalSubmit',
  /**
   *
   * @param {ModalSubmitInteraction} interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
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

    const newName = interaction.getTextInputValue("newName")
    const newSize = Number(interaction.getTextInputValue("newSize"))

    if (newName) {
        response.setColor("GREEN")
        response.setDescription(`✅ <@${interaction.user.id}> ha cambiado el nombre del canal a ${newName}`)

        const voiceChannel = await guild.channels.fetch(isOwner.id_channel);
        await voiceChannel.setName(newName);

        return interaction.reply({embeds: [response], ephemeral: true});
    } else if (newSize) {
        response.setColor("GREEN")
        response.setDescription(`✅ <@${interaction.user.id}> ha cambiado el tamaño del canal a ${newSize}`)

        const voiceChannel = await guild.channels.fetch(isOwner.id_channel);
        await voiceChannel.setUserLimit(newSize);

        return interaction.reply({embeds: [response], ephemeral: true});
    } else {
        return;
    }
  }
};

export default event;