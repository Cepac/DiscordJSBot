import { MessageEmbed } from "discord.js";

const event = {
    name: "guildBanRemove",
    async execute(member, client) {
        const { user, guild } = member;

        const memberBanned = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setColor("GREEN")
            .setTitle("Usuario desbaneado")
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()

        const audit = await guild.fetchAuditLogs({ type: 23, limit: 1 })
        memberBanned.setDescription(`
            **Usuario**: ${audit.entries.first().target.username}#${audit.entries.first().target.discriminator} <@${audit.entries.first().target.id}>
            **Responsable**: ${audit.entries.first().executor.username}#${audit.entries.first().executor.discriminator} <@${audit.entries.first().executor.id}>`)

        client.channels.cache.get(client.settings.warningLog).send({ embeds: [memberBanned] });
    }
}

export default event;
