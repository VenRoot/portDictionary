import ArgsParser from './argsParser.ts';
import Config from './config.ts';
import printHelp from "./help.ts";

const args = Deno.args;
if (args.includes('-h') || args.includes('--help')) {
  printHelp();
  Deno.exit(0);
}

const filteredArgs = args.filter(arg => arg !== '-O' && arg !== '--overwrite');
if(filteredArgs.length === 0 || !["get", "set", "delete"].includes(filteredArgs[0])) {
    printHelp();
    Deno.exit(1);
}

const config = new Config();

const argsParser = new ArgsParser(args);

const type = argsParser.getType();
const port = argsParser.getPort();
const description = argsParser.getDescription();
const configEntry = config.getEntry(port);
const isOverwrite = argsParser.hasOverwrite();

if(type === "get") {
    if(!configEntry) {
        console.log(`No entry found for port ${port}`);
        Deno.exit(0);
    }

    console.log(`Port: ${configEntry.port} | Description: ${configEntry.description}`);
    Deno.exit(0);
}

if(type === "set") {
  console.log(`Port: ${port} | Description: ${description}`);

  if(configEntry) {
    if(isOverwrite) {
      config.updateEntry(port, description);
      console.log(`Entry overwritten for port ${port} with description ${description}`);
      Deno.exit(0);
    }
    console.log(`Port ${port} already has description: ${configEntry.description}`);
    console.log("Use -O or --overwrite to override");
    Deno.exit(1);
  }

  config.addEntry({ port, description });
  console.log(`Entry added for port ${port} with description ${description}`);
  Deno.exit(0);
}

if(type === "delete") {
    if(!configEntry) {
        console.log(`No entry found for port ${port}`);
        Deno.exit(1);
    }

    config.deleteEntry(port);
    console.log(`Entry deleted for port ${port}`);
    Deno.exit(0);
}