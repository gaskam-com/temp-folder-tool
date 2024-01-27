#! /usr/bin/env node

import { LIB_VERSION } from './version';
const { Command } = require("commander");
const figlet = require("figlet");
import fs from "fs";

const program = new Command();
const configPath = "./../src/config.json"; // TODO change to can be used everywhere

program
    .version(LIB_VERSION)
    .description(
        "TempFolderTool is a CLI tool to create a folder wich will delete files after a period of time"
    )
    .option("-p, --path  [value]", "change the path of the temp folder")
    .option(
        "-r, --retention [value]",
        "change the retention period of the temp folder"
    )
    .option("-c, --config", "show the current config")
    .option("-g, --github", "open the github page")
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

async function changeRetentionPeriod(time: string) {
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

if (options.path) {
    const filepath =
        typeof options.path === "string" ? options.path : __dirname;
    changeTempFolderPath(filepath);
}

if (options.retention) {
    const time = typeof options.retention === "string" ? options.retention : "1";
    changeRetentionPeriod(time);
}

if (options.config) {
    showConfig();
}

if (options.github) {
    console.log("TempFolderTool Github Page: https://github.com/PatafixPLTX/temp-folder-tool");
}

if (!process.argv.slice(2).length) {
    console.log(figlet.textSync("Temp Folder CLI"), "\n");
    program.outputHelp();
}
