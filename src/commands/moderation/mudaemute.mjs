import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "mudaemute",
    description: "Silenciar a un usuario en tirar tryhard.",
    guildOnly: true,
    options: [
        {
            name: "objetivo",
            description: "Selecciona el objetivo de los mensajes a borrar.",
            type: "USER",
            required: true
        }
    ],
    /**
     *
     * @param { CommandInteraction } interaction
     */
    async execute(interaction, client) {
        const {channel, guild, options} = interaction;
        const target = options.getUser("objetivo");
        const member = guild.members.cache.get(target.id);
        const timeMuted = 6 * 60 * 60 * 1000;
        const targetChannel = "725015548395651074";
        const tryhardChannel = "725015736875090021";
        const tryhardRole = "863782917385748520";

        const response = new MessageEmbed()

        if(!interaction.member._roles.includes(client.settings.mudaeTryhardStaff)){
            response.setColor("YELLOW")
            response.setDescription("⚠️ No tienes permiso para usar este comando ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else if(channel.id !== tryhardChannel){
            response.setColor("YELLOW")
            response.setDescription("⚠️ Ese comando no se puede ejecutar aquí ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else if(!member._roles.includes(tryhardRole)){
            response.setColor("YELLOW")
            response.setDescription("⚠️ Ese usuario no está en Mudae Tryhard ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else {
            const mutedChannel = await guild.channels.fetch(targetChannel);
            await mutedChannel.permissionOverwrites.create(target, {VIEW_CHANNEL: false});

            setTimeout(() => {
                mutedChannel.permissionOverwrites.delete(target);
            }, timeMuted);

            response.setColor("GREEN")
            response.setDescription(`🔇 <@${target.id}> ha recibido un mute con la carta ADP 🔇`)

            return interaction.reply({embeds: [response]});
        }
    }
}

export default command;
