import { Client, MessageEmbed, Message } from "discord.js";

const event = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client
     */
    execute(oldMessage, newMessage, client) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const count = 1950;
        const original = oldMessage.content.slice(0, count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const edited = newMessage.content.slice(0, count) + (newMessage.content.length > 1950 ? " ..." : "");

        const updatedLog = new MessageEmbed()
            .setAuthor({name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL()})
            .setColor("#03c2fc")
            .setDescription(`📘 **Mensaje editado en** ${newMessage.channel} [Ver mensaje](${newMessage.url})\n
            **Antes:**\n ${original} \n **Después:**\n ${edited}`.slice("0", "4096"))
            .setFooter({text: `ID: ${newMessage.author.id}`})
            .setTimestamp()

        client.channels.cache.get(client.settings.messageLog).send({ embeds: [updatedLog] });
    }
}

export default event;
