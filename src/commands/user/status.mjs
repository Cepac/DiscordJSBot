import { MessageEmbed, CommandInteraction, Client, version } from "discord.js";
import os from "os";

const command = {
    name: "status",
    description: "Muestra el estado del bot.",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await client.user.fetch();
        await client.application.fetch();

        const guild = await client.guilds.fetch(interaction.guildId);
        const members = await guild.members.fetch();
        const realMembers = members.filter(member => member.user.bot === false);

        let systemOS;

        if(os.type().includes("Windows")){
            systemOS = "Windows";
        } else if(os.type().includes("Linux")) {
            systemOS = "Linux";
        } else {
            systemOS = "Desconocido";
        }

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`🧙🏻‍♂️ ${client.user.username} Estado`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(interaction.client.application.description || "")
            .addFields(
                { name: "👩🏻‍💻 Creador", value: `${interaction.client.application.owner.tag || "None"}`, inline: true },
                { name: "💾 Uso Memoria", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`, inline: true },
                { name: "🖥️ Sistema", value: systemOS, inline: true },
                { name: "🎛️ Node.js", value: process.version, inline: true },
                { name: "🧰 Discord.js", value: version, inline: true },
                { name: "📈 Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "⌨️ Comandos", value: `${client.commands.size}`, inline: true },
                { name: "👥 Users", value: `${realMembers.size}`, inline: true },
                { name: "📺 Channels", value: `${guild.channels.channelCountWithoutThreads}`, inline: true }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

export default command;
