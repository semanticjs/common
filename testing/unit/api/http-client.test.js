"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPClient_1 = require("../../../src/api/HTTPClient");
global.fetch = require("node-fetch");
test("basic", async () => {
    const client = new HTTPClient_1.HTTPClient();
    const resp = await client.Get("https://www.google.com");
    expect(resp.status).toBe(200);
    // expect(resp.body).toEqual(expect.stringContaining("hello"));
});
