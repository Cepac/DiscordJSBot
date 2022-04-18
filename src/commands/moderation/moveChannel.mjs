import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "mover",
    description: "Cambiar un canal de categoría.",
    permission: "MANAGE_CHANNELS",
    guildOnly: true,
    options: [
        {
            name: "canal",
            description: "Selecciona el canal que quieras mover.",
            type: "CHANNEL",
            required: true
        },
        {
            name: "categoría",
            description: "Selecciona la categoría.",
            type: "CHANNEL",
            required: true
        },
    ],
    /**
     *
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { options } = interaction;
        const target = options.getChannel("canal");
        const category = options.getChannel("categoría");
        const response = new MessageEmbed()

        if(category.type !== "GUILD_CATEGORY"){
            response.setColor("YELLOW")
            response.setDescription(`⚠️ <#${category.id}> no es una categoría ⚠️`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if(target.parentId === category.id){
            response.setColor("YELLOW")
            response.setDescription(`⚠️ <#${target.id}> ya pertenece a <#${category.id}> ⚠️`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else {
            response.setColor("GREEN")
            response.setDescription(`✅ Se ha movido <#${target.id}> a <#${category.id}> ✅`)

            await target.setParent(category.id, { lockPermissions: true })
            console.log(`Canal ${target.name} movido a ${category.name}`)

            return interaction.reply({embeds: [response], ephemeral: true});
        }
    }
}

export default command;
