import { Client } from "discord.js";

const event = {
  name: 'ready',
  /**
   *
   * @param { Client } client
   */
  async execute(client) {
    console.log('Ticket Bot ready!')
    const ticketChannel = client.channels.cache.get(client.settings.ticketChannel)

    const sendTicketMSG = () => {
      const embed = new client.discord.MessageEmbed()
        .setColor('6d6ee8')
        .setAuthor({name: 'Ticket', iconURL: client.user.avatarURL()})
        .setDescription('Haz click en el botón para abrir un ticket con las personas que quieras contactar')
      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
              .setCustomId('open-twitch')
              .setLabel('Mods Twitch')
              .setEmoji('✉️')
              .setStyle('SUCCESS'),
          new client.discord.MessageButton()
              .setCustomId('open-disc')
              .setLabel('Mods Discord')
              .setEmoji('✉️')
              .setStyle('PRIMARY'),
          new client.discord.MessageButton()
              .setCustomId('open-admin')
              .setLabel('Admin')
              .setEmoji('✉️')
              .setStyle('DANGER'),
        );

      ticketChannel.send({
        embeds: [embed],
        components: [row]
      })
    }

    const toDelete = 10000;

    const fetchMore = async (channel, limit) => {
      if (!channel) {
        throw new Error(`Expected channel, got ${typeof channel}.`);
      }
      if (limit <= 100) {
        return channel.messages.fetch({
          limit
        });
      }

      let collection = [];
      let lastId = null;
      let options = {};
      let remaining = limit;

      while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
          options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
          break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
      }
      collection.remaining = remaining;

      return collection;
    }

    const list = await fetchMore(ticketChannel, toDelete);

    let i = 1;

    list.forEach(underList => {
      underList.forEach(msg => {
        i++;
        if (i < toDelete) {
          setTimeout(function () {
            msg.delete()
          }, 1000 * i)
        }
      })
    })

    setTimeout(() => {
      sendTicketMSG()
    }, i);
  },
};

export default event;
