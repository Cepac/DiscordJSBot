import { MessageEmbed } from "discord.js";

export const autoBan = async (member) => {
    const {user, guild} = member;

    const embedDM = new MessageEmbed()
        .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
        .setColor("RED")
        .setDescription(`⛔ Has recibido un baneo automático en ${guild.name}. \n
        🛠️ Si consideras que el baneo ha sido un error, contacta con Cepac#2202`)
        .setThumbnail(guild.iconURL())
        .setFooter({text: `ID: ${user.id}`})
        .setTimestamp()

    try {
        await user.send({embeds: [embedDM]})
    } catch(err) {
        console.log(`No se pudo enviar un mensaje a ${user.tag}`);
    }

    await member.ban({days: 0, reason: "SelisBot AutoBan"});
}
