import { Client, CommandInteraction, MessageEmbed } from "discord.js";

const event = {
    name: "interactionCreate",
    /**
     *
     * @param {CommandInteraction} interaction
     * @param { Client } client
     */
    async execute(interaction, client) {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor("RED")
                .setDescription("⛔ An error occured while running this command.")
            ]}) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client)
        }
    }
}

export default event;
