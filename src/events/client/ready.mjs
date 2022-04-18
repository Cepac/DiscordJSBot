import { Client } from "discord.js";

const event = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log(`${client.user.username} ready. \n`)
        client.user.setActivity("Selis13", {type: "WATCHING"})
    }
}

export default event;
