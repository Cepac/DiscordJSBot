import { MessageEmbed } from "discord.js";

const event = {
    name: "guildMemberRemove",
    execute(member, client) {
        const { user } = member;

        const memberLeave = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setColor("RED")
            .setTitle("Salió")
            .addField("Se unió", `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, true)
            .addField("Cuenta creada", `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, true)
            .addField("Roles", `${member.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}`, false)
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()

        client.channels.cache.get(client.settings.memberLog).send({ embeds: [memberLeave] });
    }
}


export default event;
