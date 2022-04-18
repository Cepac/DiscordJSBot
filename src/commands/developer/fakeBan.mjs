import { MessageEmbed } from "discord.js";

const command = {
    name: "devtest",
    description: "Dev testing.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "objetivo",
            description: "Selecciona el objetivo del mensaje.",
            type: "USER",
            required: true
        }
    ],
    async execute(interaction) {
        const { options } = interaction;
        const target = options.getMember("objetivo");
        const response = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK")
        const embedDM = new MessageEmbed()
            .setAuthor({name: target.user.tag, iconURL: target.user.displayAvatarURL()})
            .setColor("RED")
            .setDescription(`⛔ Has recibido un baneo automático en ${interaction.guild.name}.
            🛠️ Si consideras que el baneo ha sido un error, contacta con Cepac#2202`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({text: `ID: ${target.user.id}`})
            .setTimestamp()

        if(target) {
            try {
                await target.send({embeds: [embedDM]})
            } catch (err) {
                console.log(err);
            }
            response.setDescription(`Mensaje enviado a ${target}.`);
            interaction.reply({embeds: [response], ephemeral: true});
            console.log(`${interaction.user.tag} utilizó el fake ban con ${target.user.tag}`)
        } else {
            response.setDescription(`Necesitas especificar un usuario.`);
            interaction.reply({embeds: [response], ephemeral: true});
        }
    }
}

export default command;
