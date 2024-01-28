#! /usr/bin/env node

import internal from "stream";
import { LIB_VERSION } from "./version";
const { Command } = require("commander");
const figlet = require("figlet");
import fs from "fs";

const program = new Command();
const configPath = __dirname + "/../../src/config.json";

program
    .version(LIB_VERSION)
    .description(
        "TempFolderTool is a CLI tool to create a folder which will delete files after a period of time"
    )
    .option(
        "-p, --path  [path]",
        "change the path of the temp folder (default: yourprogramfolderpath/temp)"
    )
    .option(
        "-r, --retention [value]",
        "change the retention period of the temp folder (default: 60)"
    )
    .option(
        "-c, --custom <'file name'|'value'>",
        "set a custom retention period for a file (separated by a coma)"
    )
    .option(
        "-crm, --customRemove <'file name'>",
        "remove a custom retention period for a file"
    )
    .option("-s, --show", "show the current config.json file")
    .option("-g, --github", "give the link to the GitHub page")
    .parse(process.argv);

const options = program.opts();

async function changeTempFolderPath(filepath: string) {
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configData);
        config.tempFolderPath = filepath;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error(
            "Error occurred while reading or writing the config file!",
            error
        );
    }
}

async function changeRetentionPeriod(time: number) {
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configData);
        config.retentionPeriod = time;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error(
            "Error occurred while reading or writing the config file!",
            error
        );
    }
}

async function showConfig() {
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configData);
        console.log(
            "-----| CURRENT CONFIG |-----\n",
            config,
            "\n----------------------------"
        );
    } catch (error) {
        console.error("Error occurred while reading the config file!", error);
    }
}

async function addCustom(name: string, time: number) {
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configData);
        const customRetention = { fileName: name, retentionPeriod: time };
        if (!config.custom) {
            config.custom = [];
        } else {
            const existingIndex = config.custom.findIndex(
                (custom: any) => custom.fileName === name
            );
            if (existingIndex !== -1) {
                config.custom[existingIndex] = customRetention;
            } else {
                config.custom.push(customRetention);
            }
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error(
            "Error occurred while reading or writing the config file!",
            error
        );
    }
}

if (options.path) {
    const filepath =
        typeof options.path === "string"
            ? options.path
            : __dirname + "/../../temp";
    changeTempFolderPath(filepath);
}

if (options.retention) {
    const time =
        typeof options.retention === "string"
            ? parseInt(options.retention)
            : 60;
    changeRetentionPeriod(time);
}

if (options.custom) {
    const [name, retention] = options.custom.split(",");
    if (!name || !retention) {
        console.error(
            "Please provide a file name and a time! (don't forget the coma)"
        );
        process.exit(1);
    }
    const time = parseInt(retention);
    addCustom(name, time);
}

if (options.customRemove) {
    try {
        const configData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(configData);
        const existingIndex = config.custom.findIndex(
            (custom: any) => custom.fileName === options.customRemove
        );
        if (existingIndex !== -1) {
            config.custom.splice(existingIndex, 1);
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        } else {
            console.error("No custom retention period found for this file!");
        }
    } catch (error) {
        console.error(
            "Error occurred while reading or writing the config file!",
            error
        );
    }
}

if (options.show) {
    showConfig();
}

if (options.github) {
    console.log(
        "TempFolderTool Github Page: https://github.com/PatafixPLTX/temp-folder-tool"
    );
}

if (!process.argv.slice(2).length) {
    console.log(figlet.textSync("Temp Folder CLI"), "\n");
    program.outputHelp();
}
