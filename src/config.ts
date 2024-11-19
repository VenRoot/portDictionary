import * as path from "@std/path";

class Config {
    private LOCATION: string;

    public constructor() {
        const home = Deno.env.get("HOME");
        if(!home) throw new Error("HOME environment variable not defined");
        const location = path.join(home, ".config", "venapps", "portDictionary");
        try {
            if(!Deno.statSync(location).isDirectory) {
                Deno.mkdirSync(location, { recursive: true });
            }

            if(!Deno.statSync(path.join(location, "config.json")).isFile) {
                Deno.writeTextFileSync(path.join(location, "config.json"), "[]");
                console.log(`Created config file at ${location}`);
            }
        } catch(error) {
            if(error instanceof Deno.errors.NotFound) {
                Deno.mkdirSync(location, { recursive: true });
                Deno.writeTextFileSync(path.join(location, "config.json"), "[]");
                console.log(`Created config file at ${location}`);
            } else {
                throw error;
            }
        }
        this.LOCATION = location;
    }

    private writeConfig(config: ConfigEntry[]): void {
        const configFile = path.join(this.LOCATION, "config.json");
        Deno.writeTextFileSync(configFile, JSON.stringify(config));
    }

    public readConfig(): ConfigEntry[] {
        const configFile = path.join(this.LOCATION, "config.json");
        if(!Deno.statSync(configFile).isFile) Deno.writeTextFileSync(configFile, "[]");
        const config = Deno.readTextFileSync(configFile);
        return JSON.parse(config);
    }

    public addEntry(config: ConfigEntry): void {
        const configData = this.readConfig();
        configData.push(config);
        this.writeConfig(configData);
    }

    public getEntry(port: number): ConfigEntry | undefined {
        const configData = this.readConfig();
        return configData.find(config => config.port === port);
    }

    public updateEntry(port: number, newDescription: string): void {
        const configData = this.readConfig();
        const index = configData.findIndex(entry => entry.port === port);
        if (index !== -1) {
            configData[index] = { port, description: newDescription };
            this.writeConfig(configData);
        }
    }

    public deleteEntry(port: number): boolean {
        const configData = this.readConfig();
        const index = configData.findIndex(entry => entry.port === port);
        if (index !== -1) {
            configData.splice(index, 1);
            this.writeConfig(configData);
            return true;
        }
        return false;
    }
}

export default Config;

type ConfigEntry = {
    port: number;
    description: string;
}