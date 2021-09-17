import { Get } from "../../../src/api/HTTPClient";

global.fetch = require("node-fetch");

test("basic", async () => {
  const resp = await Get("https://www.google.com");

  expect(resp.status).toBe(200);

  // expect(resp.body).toEqual(expect.stringContaining("hello"));
});
