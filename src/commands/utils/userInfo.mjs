import { ContextMenuInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "userinfo",
    type: "USER",
    context: true,
    permissions: "MANAGE_ROLES",
    /**
     *
     * @param { ContextMenuInteraction } interaction
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);

        const response = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor({name: target.user.tag, iconURL: target.user.avatarURL({dynamic: true, size: 512})})
            .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
            .addField("ID", `${target.user.id}`, true)
            .addField("Nickname", `${target.user.username}`, true)
            .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", "") || "None"}`)
            .addField("Se unió", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField("Cuenta creada", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        await interaction.reply({embeds: [response], ephemeral: true})
    }
}

export default command;
