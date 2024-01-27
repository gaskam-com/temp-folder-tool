#! /usr/bin/env node

const { Command } = require("commander");
const figlet = require("figlet");
import fs from "fs";

const program = new Command();
const configPath = "./../src/config.json"; // TODO change to can be used everywhere

program
    .version("0.0.1")
    .description(
        "TempFolderTool is a CLI tool to create a folder wich will delete files after a period of time"
    )
    .option("-p, --path  [value]", "change the path of the temp folder")
    .option(
        "-t, --time [value]",
        "change the time after which the files will be deleted"
    )
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

if (options.time) {
    const time = typeof options.time === "string" ? options.time : "1";
    changeRetentionPeriod(time);
}

if (options.path) {
    const filepath =
        typeof options.path === "string" ? options.path : __dirname;
    changeTempFolderPath(filepath);
}

if (!process.argv.slice(2).length) {
    console.log(figlet.textSync("Temp Folder CLI"));
    program.outputHelp();
}
