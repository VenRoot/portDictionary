function printHelp(): void {
    console.log(`
Usage: 
    get <port>                     Check if a port is already in use
    set <port> <description>       Set a description for a specific port
    delete <port>                  Delete an entry for a specific port

Arguments:
    port         Port number (required)
    description  Description text (required for set command)

Options:
    -O, --overwrite   Overwrite existing port description (optional for set)

Examples:
    get 8080
    set 3000 Development server
    set 8080 Production server --overwrite
    delete 8080
`);
    Deno.exit(0);
}

export default printHelp;