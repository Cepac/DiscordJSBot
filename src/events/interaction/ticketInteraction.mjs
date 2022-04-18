import discordTranscript from 'discord-html-transcripts';
import { Client, CommandInteraction } from "discord.js";

const event = {
  name: 'interactionCreate',
  /**
   *
   * @param {CommandInteraction} interaction
   * @param { Client } client
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId === "open-twitch" ||interaction.customId === "open-disc" || interaction.customId === "open-admin") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'Has creado un ticket!',
          ephemeral: true
        });
      }

      const options = {
        parent: interaction.channel.parent,
        topic: interaction.user.id,
        permissionOverwrites: [{
          id: interaction.user.id,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      };

      if (interaction.customId === "open-twitch") {
        options.permissionOverwrites.push({
          id: client.settings.roleModTwitch,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },{
          id: client.settings.roleModDisc,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        })
      } else if (interaction.customId === "open-disc") {
        options.permissionOverwrites.push({
          id: client.settings.roleModTwitch,
          deny: ['VIEW_CHANNEL'],
        },{
          id: client.settings.roleModDisc,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        })
      } else {
        options.permissionOverwrites.push({
          id: client.settings.roleModTwitch,
          deny: ['VIEW_CHANNEL'],
        },{
          id: client.settings.roleModDisc,
          deny: ['VIEW_CHANNEL'],
        })
      }

      const channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, options );
      await interaction.reply({
        content: `Ticket creado! <#${channel.id}>`,
        ephemeral: true
      });

      const embed = new client.discord.MessageEmbed()
          .setColor('6d6ee8')
          .setAuthor({name: 'Ticket'})
          .setDescription(`<@${interaction.user.id}> ha creado un ticket`)
          .setTimestamp();

      const row = new client.discord.MessageActionRow()
          .addComponents(
              new client.discord.MessageButton()
                  .setCustomId('close-ticket')
                  .setLabel('Cerrar el ticket')
                  .setEmoji('899745362137477181')
                  .setStyle('DANGER'),
          );

      const opened = await channel.send({
        embeds: [embed],
        components: [row]
      });
      await opened.pin()
      await opened.channel.bulkDelete(1);
    }

    if (interaction.customId === "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);

      const row = new client.discord.MessageActionRow()
          .addComponents(
              new client.discord.MessageButton()
                  .setCustomId('confirm-close')
                  .setLabel('Cerrar el ticket')
                  .setStyle('DANGER'),
              new client.discord.MessageButton()
                  .setCustomId('no')
                  .setLabel('No cerrar el ticket')
                  .setStyle('SECONDARY'),
          );

      await interaction.reply({
        content: 'Estas seguro de cerrar el ticket?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', async i => {
        if (i.customId === 'confirm-close') {
          const guild = client.guilds.cache.get(interaction.guildId);
          const channelToTranscript = guild.channels.cache.get(interaction.channelId);
          const transcriptChannel = guild.channels.cache.get(client.settings.transcriptionChannel);

          const transcription =  await discordTranscript.createTranscript(channelToTranscript);

          const closedBy = new client.discord.MessageEmbed()
            .setColor('6d6ee8')
            .setDescription(`🔒 Cerrado por <@${interaction.user.id}> 🔒`)
            .setTimestamp();

          transcriptChannel.send({
            embeds: [closedBy],
            files: [transcription]
          })

          await channelToTranscript.delete();

          collector.stop();
        }
        if (i.customId === 'no') {
          await interaction.editReply({
            content: 'No se ha cerrado el ticket!',
            components: []
          });
          collector.stop();
        }
      });
    }
  }
};

export default event;








