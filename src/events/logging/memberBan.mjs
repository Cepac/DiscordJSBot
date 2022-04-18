import { MessageEmbed } from "discord.js";

const event = {
    name: "guildBanAdd",
    async execute(member, client) {
        const { user, guild } = member;
        const memberBanned = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setColor("RED")
            .setTitle("Usuario baneado")
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()
        const audit = await guild.fetchAuditLogs({ type: 22, limit: 1 })

        let reason;

        if(audit.entries.first().reason){
            reason = audit.entries.first().reason;
        } else {
            reason = "Sin especificar";
        }

        memberBanned.setDescription(`
            **Usuario**: ${audit.entries.first().target.username}#${audit.entries.first().target.discriminator} <@${audit.entries.first().target.id}>
            **Razón**: ${reason}
            **Responsable**: ${audit.entries.first().executor.username}#${audit.entries.first().executor.discriminator} <@${audit.entries.first().executor.id}>`)

        client.channels.cache.get(client.settings.warningLog).send({ embeds: [memberBanned] });
    }
}

export default event;
