class ArgsParser {
    private args: string[];
    private filteredArgs: string[];

    constructor(args: string[]) {
        if(args.length === 0) throw new Error("No arguments provided");
        this.args = args;
        this.filteredArgs = args.filter(arg => arg !== '-O' && arg !== '--overwrite');
    }

    public hasOverwrite(): boolean {
        return this.args.includes('-O') || this.args.includes('--overwrite');
    }

    public getType(): "get" | "set" | "delete" {
        if(this.filteredArgs[0] === "get") return "get";
        if(this.filteredArgs[0] === "set") return "set";
        if(this.filteredArgs[0] === "delete") return "delete";
        throw new Error("Invalid argument");
    }

    public getPort(): number {
        const port = this.filteredArgs[1];
        if(isNaN(Number(port))) throw new Error("Invalid port");
        return Number(port);
    }

    public getDescription(): string {
        return this.filteredArgs.slice(2).join(" ");
    }

    public checkFormat(): void {
        const type = this.getType();
        const port = this.filteredArgs[1];
        
        if(port === undefined) throw new Error("Invalid argument");
        if(isNaN(Number(port))) throw new Error("Invalid port");
        if(Number(port) < 0 || Number(port) > 65535) throw new Error("Invalid port");

        if(type === "set") {
            const description = this.filteredArgs.slice(2).join(" ");
            if(description === undefined) throw new Error("Invalid argument");
            if(this.filteredArgs.length < 3) throw new Error("Invalid number of arguments");
            if(description.length > 255) throw new Error("Description too long");
        }
    }
}

export default ArgsParser;