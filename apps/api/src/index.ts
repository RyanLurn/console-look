import { serveOptions } from "#serve-options";

const server = Bun.serve(serveOptions);

console.log(`API server is running at ${server.url}`);
