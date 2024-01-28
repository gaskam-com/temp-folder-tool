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
const version_1 = require("./version");
const { Command } = require("commander");
const figlet = require("figlet");
const fs_1 = __importDefault(require("fs"));
const program = new Command();
const configPath = __dirname + "/../../src/config.json";
program
    .version(version_1.LIB_VERSION)
    .description("TempFolderTool is a CLI tool to create a folder which will delete files after a period of time")
    .option("-p, --path  [path]", "change the path of the temp folder (default: yourprogramfolderpath/temp)")
    .option("-r, --retention [value]", "change the retention period of the temp folder (default: 60)")
    .option("-c, --custom <'file name'|'value'>", "set a custom retention period for a file (separated by a coma)")
    .option("-s, --show", "show the current config.json file")
    .option("-g, --github", "give the link to the GitHub page")
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
function addCustomRetentionPeriod(name, time) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configData = fs_1.default.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configData);
            const customRetention = { fileName: name, retentionPeriod: time };
            if (!config.custom) {
                config.custom = [];
            }
            config.custom.push(customRetention);
            fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
        }
        catch (error) {
            console.error("Error occurred while reading or writing the config file!", error);
        }
    });
}
if (options.path) {
    const filepath = typeof options.path === "string"
        ? options.path
        : __dirname + "/../../temp";
    changeTempFolderPath(filepath);
}
if (options.retention) {
    const time = typeof options.retention === "string" ? options.retention : "60";
    changeRetentionPeriod(time);
}
if (options.custom) {
    const [name, time] = options.custom.split(",");
    if (!name || !time) {
        console.error("Please provide a file name and a time! (don't forget the coma)");
        process.exit(1);
    }
    addCustomRetentionPeriod(name, time);
}
if (options.show) {
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