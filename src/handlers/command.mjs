import { perms } from "../validation/permissions.mjs";

export const commandConfig = async (client, PG, Ascii) => {
    const table = new Ascii("Commands Loaded");

    const commandsArray = [];

    const files = await PG(`${process.cwd()}/src/commands/**/*.mjs`);
    for (const file of files) {
        const commandFile = await import(file);
        const command = commandFile.default;

        if(!command.name)
        return table.addRow(file.split("/")[7], "⛔ FAILED", "Missing a name.");

        if (!command.context && !command.description)
        return table.addRow(command.name, "🔸 FAILED", "missing a description.");

        if(command.permission) {
            if(perms.includes(command.permission))
            command.defaultPermission = false;
            else
            return table.addRow(command.name, "⛔ FAILED", "Permission is invalid.");
        }

        await client.commands.set(command.name, command);
        commandsArray.push(command);

        await table.addRow(command.name, "🔵 Succesful");
    }

    console.log(table.toString());

    client.on("ready", async () => {
        const mainGuild = await client.guilds.cache.get(client.settings.mainGuild);

        const command = await mainGuild.commands.set(commandsArray);
        const getRoles = (commandName) => {
            const cmdPerms = commandsArray.find((cmd) => cmd.name === commandName).permission;
            if(!cmdPerms) return null;

            return mainGuild.roles.cache.filter((role) => role.permissions.has(cmdPerms) && !role.managed).first(10);
        }

        const fullPermissions = command.reduce((accumulator, cmd) => {
            const roles = getRoles(cmd.name);
            if(!roles) return accumulator;

            const permissions = roles.reduce((acc, role) => {
                return [...acc, {id: role.id, type: "ROLE", permission: true}];
            }, []);

            return [...accumulator, {id: cmd.id, permissions}];
        }, []);

        await mainGuild.commands.permissions.set({ fullPermissions });
    });
}
