import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "warn",
    description: "Warn a un usuario.",
    permission: "MANAGE_MESSAGES",
    guildOnly: true,
    options: [
        {
            name: "objetivo",
            description: "Selecciona el usuario al que aplicar un warn.",
            type: "USER",
            required: true
        },
        {
            name: "razon",
            description: "Explica la razón del warn.",
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
            .setTitle("Warn")
            .setDescription(`
                **Usuario**: ${target.tag} <@${target.id}>
                **Razón**: ${reason}
                **Responsable**: ${interaction.user.tag} <@${interaction.user.id}>`)
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const embedDM = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("YELLOW")
            .setDescription(`⚠️ Has recibido un **warn** en ${interaction.guild.name}
            🗒️ **Razón**: ${reason}
            🛠️ Si no estas conforme con la sanción, puedes abrir un ticket de moderación`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const banDM = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("YELLOW")
            .setDescription(`⛔ Has recibido un ban en ${interaction.guild.name}
            🗒️ **Razón**: acumulación de warns (has recibido 3 warns en el servidor)
            🛠️ Si no estas conforme con la sanción, puedes contactar con algún miembro de moderación
            👤${interaction.user.tag}`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const response = new MessageEmbed()

        if (!member._roles.includes(firstWarn) && member._roles.includes(secondWarn)) {
            const response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⚠️ El usuario ${target} tiene 2º Warn pero no 1º Warn, revise la causa.`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if (!member._roles.includes(firstWarn)) {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha aplicado 1ºWarn a ${target}.`)
            memberWarn.setTitle("Warn | 1º Warn")

            await member.roles.add(firstWarn);

            try {
                await target.send({embeds: [embedDM]})
            } catch (err) {
                response.addFields({ name: "⚠️Aviso", value: 'El usuario no ha recibido el aviso debido a sus ajustes de privacidad', inline: true })
            }
            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberWarn]});
        } else if (!member._roles.includes(secondWarn)) {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha aplicado 2ºWarn a ${target}.`)
            memberWarn.setTitle("Warn | 2º Warn")

            await member.roles.add(secondWarn);

            try {
                await target.send({embeds: [embedDM]})
            } catch (err) {
                response.addFields({ name: "⚠️Aviso", value: 'El usuario no ha recibido el aviso debido a sus ajustes de privacidad', inline: true })
            }
            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberWarn]});
        } else {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha aplicado 3ºWarn a ${target}, el usuario recibirá un baneo por acumulación de warns.`)
            memberWarn.setTitle("Warn | 3º Warn")

            try {
                await target.send({embeds: [embedDM]})
                await target.send({embeds: [banDM]})
            } catch (err) {
                response.addFields({ name: "⚠️Aviso", value: 'El usuario no ha recibido el aviso debido a sus ajustes de privacidad', inline: true })
            }
            await interaction.reply({embeds: [response], ephemeral: true});
            await guild.members.cache.get(target.id).ban({days: 0, reason: "Acumulación de warns"});

            return client.channels.cache.get(logging).send({embeds: [memberWarn]});
        }
    }
}

export default command;
