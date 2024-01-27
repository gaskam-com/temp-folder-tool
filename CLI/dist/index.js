#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Command } = require("commander");
const figlet = require("figlet");
const fs_1 = __importDefault(require("fs"));
const program = new Command();
const configPath = "./../src/config.json"; // TODO change to can be used everywhere
program
    .version("0.0.1")
    .description("TempFolderTool is a CLI tool to create a folder wich will delete files after a period of time")
    .option("-p, --path  [value]", "change the path of the temp folder")
    .option("-r, --retention [value]", "change the retention period of the temp folder")
    .option("-c, --config", "show the current config")
    .option("-g, --github", "open the github page")
    .parse(process.argv);
const options = program.opts();
function changeTempFolderPath(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configData = fs_1.default.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configData);
            config.tempFolderPath = filepath;
            fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
        }
        catch (error) {
            console.error("Error occurred while reading or writing the config file!", error);
        }
    });
}
function changeRetentionPeriod(time) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configData = fs_1.default.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configData);
            config.retentionPeriod = time;
            fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
        }
        catch (error) {
            console.error("Error occurred while reading or writing the config file!", error);
        }
    });
}
function showConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configData = fs_1.default.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configData);
            console.log("-----| CURRENT CONFIG |-----\n", config, "\n----------------------------");
        }
        catch (error) {
            console.error("Error occurred while reading the config file!", error);
        }
    });
}
if (options.path) {
    const filepath = typeof options.path === "string" ? options.path : __dirname;
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
//# sourceMappingURL=index.js.map