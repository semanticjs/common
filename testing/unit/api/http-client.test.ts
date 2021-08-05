import HTTPClient from "../../../src/api/HTTPClient";

global.fetch = require("node-fetch");

test("basic", async () => {
  const client = new HTTPClient();

  const resp = await client.Get("https://www.google.com");

  expect(resp.status).toBe(200);

  // expect(resp.body).toEqual(expect.stringContaining("hello"));
});
