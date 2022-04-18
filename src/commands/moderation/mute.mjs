import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "mute",
    description: "Silenciar a un usuario.",
    permission: "MANAGE_MESSAGES",
    guildOnly: true,
    options: [
        {
            name: "objetivo",
            description: "Selecciona el usuario a mutear.",
            type: "USER",
            required: true
        },
        {
            name: "tipo",
            description: "Selecciona el tipo de tiempo.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "Indefinido",
                    value: "indefinido"
                },
                {
                    name: "Segundos",
                    value: "segundos"
                },
                {
                    name: "Minutos",
                    value: "minutos"
                },
                {
                    name: "Horas",
                    value: "horas"
                },
                {
                    name: "dias",
                    value: "dias"
                }
            ]
        },
        {
            name: "cantidad",
            description: "Selecciona la cantidad de tiempo.",
            type: "NUMBER",
            required: false
        },
        {
            name: "razon",
            description: "Explica la razón del mute.",
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
        const type = options.getString("tipo");
        const amount = options.getNumber("cantidad");
        const mutedRole = client.settings.mutedRole;
        const logging = client.settings.warningLog;
        const member = guild.members.cache.get(target.id);
        const seconds = 1000;
        const minutes = seconds * 60;
        const hours = minutes * 60;
        const days = hours * 24;
        const kickMemberIfIsInVoiceChannel = async (member) => {
            if (member.voice.channel) {
                await member.voice.disconnect();
            }
        }

        let reason = options.getString("razon");

        if (!reason) {
            reason = "Sin especificar";
        }

        const memberMuted = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("RED")
            .setTitle("Usuario muteado")
            .setDescription(`
                **Usuario**: ${target.tag} <@${target.id}>
                **Razón**: ${reason}
                **Responsable**: ${interaction.user.tag} <@${interaction.user.id}>`)
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const embedDM = new MessageEmbed()
            .setAuthor({name: target.tag, iconURL: target.displayAvatarURL()})
            .setColor("RED")
            .setDescription(`🔇 Has recibido un mute en ${interaction.guild.name}
            🗒️ **Razón**: ${reason}
            🛠️ **Responsable**: ${interaction.user.tag} <@${interaction.user.id}>`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.id}`})
            .setTimestamp()

        const response = new MessageEmbed()

        if (member._roles.includes(mutedRole)) {
            const response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`⚠️ El usuario ${target} ya está muteado.`)

            return interaction.reply({embeds: [response], ephemeral: true});
        }

        if (type !== 'indefinido' && !amount) {
            response.setColor("YELLOW")
            response.setDescription('⚠️ Debes elegir "Indefinido" o especificar una cantidad de tiempo.')

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if (type === 'indefinido') {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha muteado a ${target}.`)

            await member.roles.add(mutedRole);
            await kickMemberIfIsInVoiceChannel(member);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }
            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberMuted]});
        } else if (type === 'segundos') {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha muteado a ${target} durante ${amount} segundos.`)

            setTimeout(() => {
                if (member._roles.includes(mutedRole)) {
                    member.roles.remove(mutedRole);

                    memberMuted.setColor("GREEN")
                    memberMuted.setTitle("Usuario desmuteado")
                    memberMuted.setDescription(`✅ Usuario desmuteado automáticamente.`)
                    memberMuted.spliceFields(0, 25)

                    client.channels.cache.get(logging).send({embeds: [memberMuted]});
                }
            }, amount * seconds);

            await member.roles.add(mutedRole);
            await kickMemberIfIsInVoiceChannel(member);

            embedDM.addField("**Tiempo**", `${amount} segundos`);
            memberMuted.addField("**Tiempo**", `${amount} segundos`);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }

            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberMuted]});
        } else if (type === 'minutos') {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha muteado a ${target} durante ${amount} minutos.`)

            setTimeout(() => {
                if (member._roles.includes(mutedRole)) {
                    member.roles.remove(mutedRole);

                    memberMuted.setColor("GREEN")
                    memberMuted.setTitle("Usuario desmuteado")
                    memberMuted.setDescription(`✅ Usuario desmuteado automáticamente.`)
                    memberMuted.spliceFields(0, 25)

                    client.channels.cache.get(logging).send({embeds: [memberMuted]});
                }
            }, amount * minutes);

            await member.roles.add(mutedRole);
            await kickMemberIfIsInVoiceChannel(member);

            embedDM.addField("**Tiempo**", `${amount} minutos`);
            memberMuted.addField("**Tiempo**", `${amount} minutos`);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }

            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberMuted]});
        } else if (type === 'horas') {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha muteado a ${target} durante ${amount} horas.`)

            setTimeout(() => {
                if (member._roles.includes(mutedRole)) {
                    member.roles.remove(mutedRole);

                    memberMuted.setColor("GREEN")
                    memberMuted.setTitle("Usuario desmuteado")
                    memberMuted.setDescription(`✅ Usuario desmuteado automáticamente.`)
                    memberMuted.spliceFields(0, 25)

                    client.channels.cache.get(logging).send({embeds: [memberMuted]});
                }
            }, amount * hours);

            await member.roles.add(mutedRole);
            await kickMemberIfIsInVoiceChannel(member);

            embedDM.addField("**Tiempo**", `${amount} horas`);
            memberMuted.addField("**Tiempo**", `${amount} horas`);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }

            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberMuted]});
        } else {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha muteado a ${target} durante ${amount} días.`)

            setTimeout(() => {
                if (member._roles.includes(mutedRole)) {
                    member.roles.remove(mutedRole);

                    memberMuted.setColor("GREEN")
                    memberMuted.setTitle("Usuario desmuteado")
                    memberMuted.setDescription(`✅ Usuario desmuteado automáticamente.`)
                    memberMuted.spliceFields(0, 25)

                    client.channels.cache.get(logging).send({embeds: [memberMuted]});
                }
            }, amount * days);

            await member.roles.add(mutedRole);
            await kickMemberIfIsInVoiceChannel(member);

            embedDM.addField("**Tiempo**", `${amount} días`);
            memberMuted.addField("**Tiempo**", `${amount} días`);

            try {
                await target.send({embeds: [embedDM], ephemeral: true})
            } catch (err) {
                console.log(err);
            }

            await interaction.reply({embeds: [response], ephemeral: true});

            return client.channels.cache.get(logging).send({embeds: [memberMuted]});
        }
    }
}

export default command;
