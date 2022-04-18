import { MessageEmbed } from "discord.js";

const command = {
    name: "devtest2",
    description: "Dev testing.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "objetivo",
            description: "Selecciona el objetivo del mensaje.",
            type: "USER",
            required: true
        },
        {
            name: "razon",
            description: "Explica la razón del warn.",
            type: "STRING",
            required: false
        }
    ],
    async execute(interaction) {
        const { options } = interaction;
        const target = options.getMember("objetivo");
        const response = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK")

        let reason = options.getString("razon");

        if (!reason) {
            reason = "Sin especificar";
        }

        const embedDM = new MessageEmbed()
            .setAuthor({name: target.user.tag, iconURL: target.user.displayAvatarURL()})
            .setColor("YELLOW")
            .setDescription(`⚠️ Has recibido un warn en ${interaction.guild.name}.
            **Razón**: ${reason} \n
            🛠️ Si consideras que ha sido un error, contacta con Cepac#2202`)
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
            console.log(`${interaction.user.tag} utilizó el fake warn con ${target.user.tag}`)
        } else {
            response.setDescription(`Necesitas especificar un usuario.`);
            interaction.reply({embeds: [response], ephemeral: true});
        }
    }
}

export default command;
