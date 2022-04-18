import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "abrir",
    description: "Abre un canal.",
    permission: "MANAGE_CHANNELS",
    guildOnly: true,
    /**
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { channel, guild } = interaction;

        const response = new MessageEmbed()

        if(channel.permissionsFor(guild.id).has('SEND_MESSAGES')){
            response.setColor("YELLOW")
            response.setDescription("⚠️ El canal ya está abierto ⚠️")

            await interaction.reply({embeds: [response], ephemeral: true});
        } else {
            await channel.permissionOverwrites.edit(
                guild.id, {VIEW_CHANNEL: false, SEND_MESSAGES: null}
            )

            response.setColor("GREEN")
            response.setDescription(`🔓 <@${interaction.user.id}> ha abierto el canal 🔓`)

            await interaction.reply({embeds: [response]})
        }
    }
}

export default command;
