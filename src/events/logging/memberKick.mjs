import { MessageEmbed } from "discord.js";

const event = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const { user, guild } = member;
        const audit = await guild.fetchAuditLogs({ type: 20, limit: 1 })

        let reason;

        if(audit.entries.first().reason){
            reason = audit.entries.first().reason;
        } else {
            reason = "Sin especificar";
        }

        if(user.id === audit.entries.first().target.id){
            const memberKicked = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setColor("RED")
            .setTitle("Usuario kickeado")
            .setDescription(`
                **Usuario**: ${audit.entries.first().target.username}#${audit.entries.first().target.discriminator} <@${audit.entries.first().target.id}>
                **Razón**: ${reason}
                **Responsable**: ${audit.entries.first().executor.username}#${audit.entries.first().executor.discriminator} <@${audit.entries.first().executor.id}>`)
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()

            client.channels.cache.get(client.settings.warningLog).send({ embeds: [memberKicked] });
        }
    }
}

export default event;
