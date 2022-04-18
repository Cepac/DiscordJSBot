import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "unwarn",
    description: "Silenciar a un usuario.",
    permission: "MANAGE_MESSAGES",
    guildOnly: true,
    options: [
        {
            name: "objetivo",
            description: "Selecciona el usuario al que retirar un warn.",
            type: "USER",
            required: true
        },
        {
            name: "razon",
            description: "Explica la razón del retiro de warn.",
            type: "STRING",
            required: false
        }
    ],
    /**
     *
     * @param { CommandInteraction } interaction
     */
    async execute(interaction, client) {
        const {guild, options} = interaction;
        const target = options.getUser("objetivo");
        const member = guild.members.cache.get(target.id);
        const logging = client.settings.warningLog;
        const firstWarn = client.settings.firstWarn;
        const secondWarn = client.settings.secondWarn;
        
        let reason = options.getString("razon");

        if (!reason) {
            reason = "Sin especificar";
        }

        const memberWarn = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("YELLOW")
            .setTitle("Warn retirado")
            .setDescription(`
                **Usuario**: ${target.tag} <@${target.id}>
                **Razón**: ${reason}
                **Responsable**: ${interaction.user.tag} <@${interaction.user.id}>`)
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const embedDM = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("YELLOW")
            .setDescription(`⚠️ Se te ha retirado un **warn** en ${interaction.guild.name}
            🗒️ **Razón**: ${reason}
            🛠️ Si tienes alguna duda, puedes abrir un ticket de moderación`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const response = new MessageEmbed()

        if (!member._roles.includes(firstWarn) && !member._roles.includes(secondWarn)) {
            const response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⚠️ El usuario ${target} no tiene warns.`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if (!member._roles.includes(firstWarn) && member._roles.includes(secondWarn)) {
            const response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⚠️ El usuario ${target} tiene 2º Warn pero no 1º Warn, revise la causa.`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if (member._roles.includes(secondWarn)) {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha retirado 2ºWarn a ${target}.`)
            memberWarn.setTitle("Warn retirado | 2º Warn")

            await member.roles.remove(secondWarn);

            try {
                await target.send({embeds: [embedDM]})
            } catch (err) {
                response.addFields({ name: "⚠️Aviso", value: 'El usuario no ha recibido el aviso debido a sus ajustes de privacidad', inline: true })
            }
            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberWarn]});
        } else if (member._roles.includes(firstWarn)) {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha retirado 1ºWarn a ${target}.`)
            memberWarn.setTitle("Warn retirado | 1º Warn")

            await member.roles.remove(firstWarn);

            try {
                await target.send({embeds: [embedDM]})
            } catch (err) {
                response.addFields({ name: "⚠️Aviso", value: 'El usuario no ha recibido el aviso debido a sus ajustes de privacidad', inline: true })
            }
            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberWarn]});
        }  
    }
}

export default command;
