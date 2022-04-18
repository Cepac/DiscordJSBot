import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "cerrar",
    description: "Cierra un canal.",
    permission: "MANAGE_CHANNELS",
    guildOnly: true,
    /**
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { channel, guild } = interaction;
        const response = new MessageEmbed()

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

export default command;
