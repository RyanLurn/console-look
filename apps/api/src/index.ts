const server = Bun.serve({
  routes: {
    "/": new Response("OK"),
  },

  fetch(_req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
