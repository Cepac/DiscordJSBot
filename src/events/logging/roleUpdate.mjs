import { MessageEmbed } from "discord.js";

const event = {
    name: "guildMemberUpdate",
    async execute(member, memberUpdated, client) {
        const { user, guild } = member;

        const rolesDifference = memberUpdated.roles.cache.difference(member.roles.cache);
        if(rolesDifference.size === 0) return;

        let rolesArray = [];
        rolesDifference.forEach(key => {
            if (!client.settings.autoRoles.includes(key.id)) {
                rolesArray.push(key.id)
            }
        });
        const audit = await guild.fetchAuditLogs({ type: 25, limit: 1 })
        const rolesUpdated = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()

        if(memberUpdated.roles.cache.size > member.roles.cache.size) {
            rolesUpdated.setColor("GREEN")
            rolesUpdated.setTitle("Rol añadido")
        } else {
            rolesUpdated.setColor("RED")
            rolesUpdated.setTitle("Rol quitado")
        }

        if (rolesArray.length > 0){
            const roles = rolesArray.length === 1 ? `<@&${rolesArray[0]}>` : `<@&${rolesArray.map(r => r).join("> <@&") || "None"}>`;
            rolesUpdated.addField("Roles", roles)
                .addField("Realizado por", `<@${audit.entries.first().executor.id}>`, false)
        } else {
            const roles = rolesDifference.length === 1 ? `${rolesDifference[0]}` : `${rolesDifference.map(r => r).join(' ')}`;
            rolesUpdated.addField("Roles", roles)
        }

        client.channels.cache.get(client.settings.rolesLog).send({ embeds: [rolesUpdated] });
    }
}

export default event;

