#! /usr/bin/env bun
import { register, init } from "./output/commands";
import path from "node:path";
const __dirname = import.meta.dir;
const configPath = path.join(__dirname, "./../src/config.json");
import { version } from "./package.json";
import { BunFile } from "bun";
import { $ } from "bun";

register(["-c", "--config"], "show the current config", showConfig);
register(["-v", "--version"], "show the cli version number", () => console.log(version));
register(["-p", "--path"], "change the path of the temp folder", changePath);
register(["-g", "--github"], "open the github page", async () => await $`xdg-open http://google.com`);
init();

function showConfig() {
    try {
        Bun.file(configPath).json().then((data) => {
            console.log(
                "-----| CURRENT CONFIG |-----\n",
                data,
                "\n----------------------------"
            );
        });
    } catch (error) {
        console.error("Error occurred while reading the config file!", error);
    }
}

async function changePath(args: string[]) {
    const configFile: BunFile = Bun.file(configPath);

    let { tempFolderPath, ...data } = await configFile.json();
    tempFolderPath = args[0];
    Bun.write(
        configFile,
        JSON.stringify({
            ...data,
            tempFolderPath,
        })
    )
}