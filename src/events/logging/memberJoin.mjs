import { MessageEmbed } from "discord.js";
import { autoBan } from "../../utils/autoBan.mjs";

const event = {
    name: "guildMemberAdd",
    async execute(member, client) {
        const { user } = member;
        const now = new Date();

        const memberJoin = new MessageEmbed()
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .setColor("BLUE")
            .setTitle("Nuevo usuario")
            .addField("Cuenta creada", `<t:${parseInt(user.createdTimestamp / 1000)}:R>`, true)
            .setFooter({text: `ID: ${user.id}`})
            .setTimestamp()

        if(now - user.createdAt < 1000*60*60*24){
            memberJoin.setDescription("⚠️ Cuenta creada hace menos de 24 horas ⚠️");

            await autoBan(member);
        }

        client.channels.cache.get(client.settings.memberLog).send({ embeds: [memberJoin] });
    }
}

export default event;
