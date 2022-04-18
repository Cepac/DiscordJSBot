import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "clear",
    description: "Borrar una cantidad especifica de mensajes de un canal o usuario.",
    permission: "MANAGE_MESSAGES",
    guildOnly: true,
    options: [
        {
            name: "cantidad",
            description: "Selecciona la cantidad de mensajes que quieres borrar de un canal o usuario.",
            type: "NUMBER",
            required: true
        },
        {
            name: "objetivo",
            description: "Selecciona el objetivo de los mensajes a borrar.",
            type: "USER",
            required: false
        }
    ],
    /**
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { channel, options } = interaction;
        const amount = options.getNumber("cantidad");
        const target = options.getMember("objetivo");
        const messages = await channel.messages.fetch();
        const response = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK");

        if(amount > 100 || amount <= 0) {
            response.setDescription("La cantidad debe ser mayor que 0 y menor que 100.")
            return interaction.reply({embeds: [response]})
        }

        if(target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if(m.author.id === target.id && amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            const msgs = await channel.bulkDelete(filtered, true)
            response.setDescription(`🧹 ${msgs.size} mensajes eliminados de ${target}.`);
            await interaction.reply({embeds: [response]});
        } else {
            const msgs = await channel.bulkDelete(amount, true)
            response.setDescription(`🧹 ${msgs.size} mensajes eliminados.`);
            await interaction.reply({embeds: [response]});
        }
    }
}

export default command;
