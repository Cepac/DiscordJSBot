import { Client, ButtonInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { TextInputComponent, Modal, showModal } from 'discord-modals';
import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const event = {
  name: 'interactionCreate',
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
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

    let newName = new TextInputComponent()
        .setCustomId('newName')
        .setLabel('Editar nombre del canal')
        .setMinLength(1)
        .setMaxLength(40)
        .setRequired(true)
        .setStyle("SHORT")

    let newSize = new TextInputComponent()
        .setCustomId('newSize')
        .setLabel('Editar tamaño del canal')
        .setPlaceholder('De 1 a 99')
        .setMaxLength(2)
        .setRequired(true)
        .setStyle("SHORT")

    const newRegion = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('newRegion')
            .setPlaceholder('Elige una región')
            .addOptions([
                {
                    label: 'Rotterdam',
                    description: 'This is also a description',
                    value: 'rotterdam',
                },
                {
                    label: 'Brasil',
                    description: 'This is also a description',
                    value: 'brazil',
                },
                {
                    label: 'Este EEUU',
                    description: 'This is also a description',
                    value: 'us-east',
                },
                {
                    label: 'Sur EEUU',
                    description: 'This is also a description',
                    value: 'us-south',
                },
            ])
        )
      
    const editName = new Modal()
        .setCustomId("edit-name")
        .setTitle("Editar nombre del canal")
        .addComponents([ newName ])

    const editSize = new Modal()
        .setCustomId("edit-size")
        .setTitle("Editar tamaño del canal")
        .addComponents([ newSize ])

    if (interaction.customId === "lock-channel") {
        const voiceChannel = await guild.channels.fetch(isOwner.id_channel);
        await voiceChannel.setUserLimit(1);

        response.setColor("GREEN")
        response.setDescription("✅ Canal limitado a 1 ✅")

        return interaction.reply({embeds: [response], ephemeral: true});
    } else if (interaction.customId === "edit-name") {
        await showModal(editName, {
          client: client,
          interaction: interaction
        })
    } else if (interaction.customId === "edit-size") {
        await showModal(editSize, {
          client: client,
          interaction: interaction
        })
    } else if (interaction.customId === "edit-region") {
        await interaction.reply({ content: "Selecciona la región para el canal de voz", components: [newRegion], ephemeral: true })
    }
  }
};

export default event;