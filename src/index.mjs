import dotenv from "dotenv"
dotenv.config();
import { Client, Collection } from "discord.js";
import { promisify } from "util";
import glob from "glob";
import Ascii from "ascii-table";
import Discord from 'discord.js';
import { readFile } from "fs/promises";
import { commandConfig } from "./handlers/command.mjs";
import { eventsConfig } from "./handlers/events.mjs";
import discordModals from "discord-modals";
const settings = JSON.parse(await readFile(`${process.cwd()}/config.json`));
const PG = promisify(glob);
const client = new Client({ intents: 8143 });
discordModals(client);

client.discord = Discord;
client.commands = new Collection();
client.voiceGenerator = new Collection();
client.settings = settings;

try {
    await eventsConfig(client, PG, Ascii);
    await commandConfig(client, PG, Ascii);

    await client.login(process.env.TOKEN);
    console.log("Client logged in as " + client.user.tag)
} catch (err) {
    console.log(err)
}
