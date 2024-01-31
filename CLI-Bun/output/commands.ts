import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard.js";
figlet.parseFont("Standard", standard);
const banner = figlet.textSync("Temp Folder CLI", {
    font: "Standard",
});

// Note: Rgb color with \x1b[38;2;{r};{g};{b}m ... [0m
const decorators = {
    start: "\x1b[38;2;2;255;144m",
    end: "\x1b[0m",
}
const [ , __dirname, command, ...args ] = Bun.argv;

const functions: Map<string[], string> = new Map();

let longestAlias = -1;

export function register(aliases: string[], pattern: string, callback: (args: string[]) => void) {
    if (aliases.includes(command)) {
        callback(args);
    }
    const length = aliases.join(', ').length;
    if (length > longestAlias) {
        longestAlias = length;
    }
    functions.set(aliases, pattern);
}

export function init() {
    if (command === undefined) {
        console.log(banner);
        console.log("\nUsage: temp <command> [options]\n");
        console.log("Commands:");
        functions.forEach((pattern, aliases) => {
            const alias = aliases.join(", ");
            const padding = " ".repeat(longestAlias - alias.length + 1);
            console.log(`  ${alias}${padding}${decorators.start}${pattern}${decorators.end}`);
        });
    }
}


// register(["-h", "--help"], "show this help message", showHelp);
