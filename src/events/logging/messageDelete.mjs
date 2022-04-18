import { Client, MessageEmbed, Message } from "discord.js";

const event = {
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    execute(message, client) {
        if(message.author.bot) return;

        const deletedLog = new MessageEmbed()
            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
            .setColor("#fc0320")
            .setDescription(`📕 **Mensaje eliminado en** ${message.channel}.\n
            **Mensaje:**\n ${message}`.slice("0", "4096"))
            .setFooter({text: `ID: ${message.author.id}`})
            .setTimestamp()

        if(message.attachments && message.attachments.size <= 25){
            let i = 1;
            message.attachments.forEach(image => {
                deletedLog.addField(`Imagen ${i}`, `[Ver](${image.url})`, true)
                i++;
            })
        }

        client.channels.cache.get(client.settings.messageLog).send({ embeds: [deletedLog] });
    }
}

export default event;
