#! /usr/bin/env bun
import { register, init } from "./output/commands";
import path from "node:path";
const __dirname = import.meta.dir;
const configPath = path.join(__dirname, "./../src/config.json");
const file = Bun.file(import.meta.dir + '/package.json'); // BunFile

const { version } = await file.json();

register(["-c", "--config"], "show the current config", showConfig);
register(["-v", "--versioning"], "show the cli version number", () => console.log(version));
// register(["-p", "--path"], "change the path of the temp folder");
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