import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "unmute",
    description: "Desilenciar a un usuario.",
    permission: "MANAGE_MESSAGES",
    guildOnly: true,
    options: [
        {
            name: "objetivo",
            description: "Selecciona el usuario al que quitar el mute.",
            type: "USER",
            required: true
        },
        {
            name: "razon",
            description: "Explica la razón del unmute.",
            type: "STRING",
            required: false
        }
    ],
    /**
     *
     * @param { CommandInteraction } interaction
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;
        const muterole = client.settings.mutedRole;
        const logging = client.settings.warningLog;
        const target = options.getUser("objetivo");
        const member = guild.members.cache.get(target.id);

        let reason = options.getString("razon");

        if(!reason){
            reason = "Sin especificar";
        }

        const memberUnmuted = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("GREEN")
            .setTitle("Usuario desmuteado")
            .setDescription(`
                **Usuario**: ${target.tag} <@${target.id}>
                **Razón**: ${reason}
                **Responsable**: ${interaction.user.tag} <@${interaction.user.id}>`)
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const embedDM = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("GREEN")
            .setDescription(`🔈 Ya no estas muted en ${interaction.guild.name}
            🗒️ **Razón**: ${reason}`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const response = new MessageEmbed()

        if(!member._roles.includes(muterole)){
            response.setColor("RED")
            response.setDescription(`⚠️ El usuario ${target} no está muteado.`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha desmuteado a ${target}.`)

            await member.roles.remove(muterole);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }

            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({ embeds: [memberUnmuted] })
        }
    }
}

export default command;
