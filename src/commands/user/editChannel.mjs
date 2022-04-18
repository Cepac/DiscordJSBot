import { CommandInteraction, MessageEmbed } from "discord.js";

const command = {
    name: "editar",
    description: "Editar nombre y/o tamaño de un canal de voz temporal.",
    guildOnly: true,
    options: [
        {
            name: "canal",
            description: "Selecciona el canal.",
            type: "CHANNEL",
            required: true
        },
        {
            name: "nombre",
            description: "Especifica el nombre.",
            type: "STRING",
            required: false
        },
        {
            name: "tamaño",
            description: "Especifica el tamaño.",
            type: "NUMBER",
            required: false
        }
    ],
    /**
     *
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { options } = interaction;
        const target = options.getChannel("canal");
        const targetName = options.getString("nombre");
        const targetSize = options.getNumber("tamaño");
        const response = new MessageEmbed()

        if(!target.permissionsFor(interaction.member).has("MANAGE_CHANNELS")){
            response.setColor("YELLOW")
            response.setDescription(`⚠️ No tienes permisos para editar ese canal ⚠️`)

            return interaction.reply({embeds: [response], ephemeral: true});
        };

        if(!target.isVoice()){
            response.setColor("YELLOW")
            response.setDescription(`⚠️ Debes especificar un canal de voz ⚠️`)

            return interaction.reply({embeds: [response], ephemeral: true});
        };

        if(!targetName && !targetSize){
            response.setColor("YELLOW")
            response.setDescription(`⚠️ Debes especificar nombre y/o tamaño ⚠️`)

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if(targetName && targetSize){
            response.setColor("GREEN")
            response.setDescription(`✅ Cambios realizados a ${target.name}:
            **Nombre**: ${targetName}
            **Tamaño**: ${targetSize}`)

            await target.setName(targetName);
            await target.setUserLimit(targetSize);

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if(targetName){
            response.setColor("GREEN")
            response.setDescription(`✅ Cambios realizados a ${target.name}:
            **Nombre**: ${targetName}`)

            await target.setName(targetName);

            return interaction.reply({embeds: [response], ephemeral: true});
        } else if(targetSize){
            response.setColor("GREEN")
            response.setDescription(`✅ Cambios realizados a ${target.name}:
            **Tamaño**: ${targetSize}`)

            await target.setUserLimit(targetSize);

            return interaction.reply({embeds: [response], ephemeral: true});
        }
    }
}

export default command;
