import { events } from "../validation/eventNames.mjs";

export const eventsConfig = async (client, PG, Ascii) => {
    const table = new Ascii("Events Loaded");

    const files = await PG(`${process.cwd()}/src/events/**/*.mjs`);
    for (const file of files) {
        const eventFile = await import(file);
        const event = eventFile.default;

        if(!events.includes(event.name) || !event.name) {
            const L = file.split("/");
            await table.addRow(`${event.name || "Missing"}`, `⛔ Event name is invalid or missing: ${L[6] + "/" + L[7]}`);
            return;
        }

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        await table.addRow(event.name, "✓ Succesful")
    }

    console.log(table.toString());
}
