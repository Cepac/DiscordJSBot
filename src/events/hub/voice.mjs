import { VoiceState, Client, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import discordTranscript from 'discord-html-transcripts';

import { connectDB, sequelize } from"../../utils/connectDB.mjs";
import { configChannel as configChannelModel } from"../../models/configChannel.mjs";
import { configRole as configRoleModel } from"../../models/configRole.mjs";
import { tempChannel as configTempChannelModel } from"../../models/tempChannel.mjs";

const voice = {
    name: "voiceStateUpdate",
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client
     */
    async execute(oldState, newState, client) {
        await connectDB();
        const { member, guild } = newState;
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const guildId = guild.id;
        const configChannel = configChannelModel(sequelize);
        const configRole = configRoleModel(sequelize);
        const tempChannel = configTempChannelModel(sequelize);
        const ttsBotId = '961244069437276210';
        const threadParent = await guild.channels.fetch('862989188059103252');

        let ownedChannel;
        let hubID;
        let textChannel;

        const configChannelResult = await configChannel.findOne({ where: { id_server: guildId, category: 'HUB' } });

        const embed = new MessageEmbed()
            .setColor('6d6ee8')
            .setAuthor({name: 'Opciones de edición del canal', iconURL: client.user.avatarURL()})
            .setDescription('Haz click en el botón correspondiente para editar las diferentes opciones del canal de voz temporal')
            .addFields(
                { name: "🔒 Limitar", value: "Establece el limite del canal de voz en 1", inline: false },
                { name: "🪧 Nombre", value: "Permite editar el nombre del canal", inline: false },
                { name: "👥 Tamaño", value: "Permite modificar el tamaño del canal de voz", inline: false },
                { name: "🗺️ Región", value: "Permite modificar la región del canal de voz", inline: false }
            )

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('lock-channel')
                    .setLabel('Limitar')
                    .setEmoji('🔒')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('edit-name')
                    .setLabel('Nombre')
                    .setEmoji('🪧')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('edit-size')
                    .setLabel('Tamaño')
                    .setEmoji('👥')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('edit-region')
                    .setLabel('Región')
                    .setEmoji('🗺️')
                    .setStyle('SECONDARY'),
            )

        if (configChannelResult !== null) {
            hubID = configChannelResult.id_channel;
        }

        if(newChannel && newChannel.id === hubID) {
            if(guild.premiumTier === 'TIER_2' || guild.premiumTier === 'TIER_3'){
                textChannel = await threadParent.threads.create({
                    name: `Sin micro de ${member.user.username}`,
                    autoArchiveDuration: 10080,
                    type: "GUILD_PRIVATE_THREAD"
                });
                await textChannel.setLocked(true);
                await textChannel.setInvitable(false);
                textChannel.members.add(member)
            } else {
                textChannel = await guild.channels.create(`Sin micro de ${member.user.username}`, {
                    type: "GUILD_TEXT",
                    parent: newChannel.parent,
                    permissionOverwrites: [
                        {id: member.id, allow: ["VIEW_CHANNEL"]},
                        {id: client.settings.roleModDisc, allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']},
                        {id: ttsBotId, allow: ["VIEW_CHANNEL"]},
                        {id: guild.id, deny: ["VIEW_CHANNEL"]}
                    ]
                });
            }

            
            const tempChannelEmbed = await textChannel.send({ embeds: [embed], components: [row] });
            await tempChannelEmbed.pin();
            await textChannel.send(`<@&${ttsBotId}> añadido al hilo`);

            const voiceChannel = await guild.channels.create(`『🔊』Canal de ${member.user.username}`, {
                type: "GUILD_VOICE",
                parent: newChannel.parent,
                userLimit: 10,
                bitrate: 64000,
                permissionOverwrites: [
                    {id: guild.id, deny: ["VIEW_CHANNEL"]},
                    {id: ttsBotId, allow: ["VIEW_CHANNEL"]}
                ]
            });

            const followerID = await configRole.findOne({ where: { id_server: guildId, category: 'Follower' } });

            if (followerID !== null) {
                await voiceChannel.permissionOverwrites.edit(
                    followerID.id_role, {VIEW_CHANNEL: true}
                )
            }

            const mutedID = await configRole.findOne({ where: { id_server: guildId, category: 'Muted' } });

            if (mutedID !== null) {
                await voiceChannel.permissionOverwrites.edit(
                    mutedID.id_role, {VIEW_CHANNEL: true, CONNECT: false, SPEAK: false}
                )
                if(!textChannel.isThread()){
                    await textChannel.permissionOverwrites.edit(
                        mutedID.id_role, {VIEW_CHANNEL: false}
                    )
                }
            }

            client.voiceGenerator.set(member.id, voiceChannel.id);

            await newChannel.permissionOverwrites.edit(member, {CONNECT: false});

            setTimeout(() => newChannel.permissionOverwrites.delete(member), 5 * 1000);

            ownedChannel = client.voiceGenerator.get(member.id)

            await tempChannel.create({ id_user: member.id, id_channel: ownedChannel, id_text_channel: textChannel.id });

            return setTimeout(() => member.voice.setChannel(voiceChannel), 500);
        }

        if (oldChannel) {
            let tempChannelId;
            let tempChannelOwner;

            const tempChannelResult = await tempChannel.findOne({ where: { id_channel: oldChannel.id } });

            if (tempChannelResult !== null) {
                tempChannelId = tempChannelResult.id_channel;
                tempChannelOwner = tempChannelResult.id_user;
                textChannel = await guild.channels.fetch(tempChannelResult.id_text_channel);
            }

            if(tempChannelId && tempChannelId === oldChannel.id && oldChannel.members.size === 0) {
                client.voiceGenerator.set(member.id, null);
                oldChannel.delete().catch(() => {});
                if(textChannel) {
                    const transcriptChannel = guild.channels.cache.get(client.settings.transcriptionHubChannel);

                    const transcription =  await discordTranscript.createTranscript(textChannel);

                    await transcriptChannel.send({
                        files: [transcription]
                    })

                    textChannel.delete().catch(() => {});
                }

                await tempChannel.destroy({ where: { id_user: member.id, id_channel: oldChannel.id } });

            } else if(tempChannelOwner && member.id === tempChannelOwner && tempChannelId && tempChannelId === oldChannel.id && member.voice.channelId !== oldChannel.id && oldChannel.members.size >= 1){
                const position = Math.floor(Math.random() * oldChannel.members.size)
                const newOwner = oldChannel.members.keyAt(position)

                await tempChannel.update({ id_user: oldChannel.members.keyAt(position) },{ where: { id_channel: oldChannel.id } });

                textChannel.send(`🔑 <@${newOwner}> ha recibido los permisos de la sala`)
            }
        }
    }
}

export default voice;
