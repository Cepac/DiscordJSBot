import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "mudaecerrar",
    description: "Cierra un canal de mudae.",
    guildOnly: true,
    /**
     * @param { CommandInteraction } interaction
     */
    async execute(interaction, client) {
        const { channel, guild } = interaction;
        const response = new MessageEmbed()
        const mudaeChillStaff = client.settings.mudaeChillStaff;
        const mudaeTryhardStaff = client.settings.mudaeTryhardStaff;
        const mudaeChillChannels = client.settings.mudaeChillChannels;
        const mudaeTryhardChannels = client.settings.mudaeTryhardChannels;

        if(!mudaeChillChannels.includes(channel.id) && !mudaeTryhardChannels.includes(channel.id)){
            response.setColor("YELLOW")
            response.setDescription("⚠️ Ese comando no se puede ejecutar aquí ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else if((!interaction.member._roles.includes(mudaeChillStaff) && mudaeChillChannels.includes(channel.id)) || (!interaction.member._roles.includes(mudaeTryhardStaff) && mudaeTryhardChannels.includes(channel.id))){
            response.setColor("YELLOW")
            response.setDescription("⚠️ No tienes permisos para ejecutar ese comando ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else if((interaction.member._roles.includes(mudaeChillStaff) && !mudaeChillChannels.includes(channel.id)) && (interaction.member._roles.includes(mudaeTryhardStaff) && !mudaeTryhardChannels.includes(channel.id))){
            response.setColor("YELLOW")
            response.setDescription("⚠️ No tienes permisos para ejecutar ese comando en este canal ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else if((interaction.member._roles.includes(mudaeChillStaff) && mudaeChillChannels.includes(channel.id)) || (interaction.member._roles.includes(mudaeTryhardStaff) && mudaeTryhardChannels.includes(channel.id))){
            if(!channel.permissionsFor(guild.id).has('SEND_MESSAGES')){
                response.setColor("YELLOW")
                response.setDescription("⚠️ El canal ya está cerrado ⚠️")
    
                await interaction.reply({embeds: [response], ephemeral: true});
            } else {
                await channel.permissionOverwrites.edit(
                    guild.id, {VIEW_CHANNEL: false, SEND_MESSAGES: false}
                )
    
                response.setColor("RED")
                response.setDescription(`🔒 <@${interaction.user.id}> ha cerrado el canal 🔒`)
    
                await interaction.reply({embeds: [response]})
            }
        }        
    }
}

export default command;
