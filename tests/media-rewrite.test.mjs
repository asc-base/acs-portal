import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";

const basePath = "/media/acs-bucket-staging/public/profiles/52007765-d4de-4bb3-b964-5b39b4ada79d";

async function startServer(server) {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function freePort() {
  const server = createServer();
  const port = await startServer(server);
  await closeServer(server);
  return port;
}

async function withPortal({ endpoint, bucket = "acs-bucket-staging" }, run) {
  const port = await freePort();
  const env = {
    ...process.env,
    NODE_ENV: "production",
    API_URL: "http://127.0.0.1:1",
    PORT: String(port),
  };
  env.RUSTFS_READ_ENDPOINT = endpoint ?? "";
  env.RUSTFS_BUCKET = bucket ?? "";

  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
    cwd: process.cwd(),
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { logs += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk) => { logs += chunk; });

  try {
    const origin = `http://127.0.0.1:${port}`;
    const deadline = Date.now() + 30_000;
    let lastStatus = "no response";
    while (Date.now() < deadline) {
      if (child.exitCode !== null) throw new Error(`Next.js exited (${child.exitCode}): ${logs}`);
      let response;
      try {
        response = await fetch(`${origin}/admin/auth`, {
          signal: AbortSignal.timeout(2_000),
        });
      } catch (error) {
        lastStatus = error.message;
        await delay(100);
        continue;
      }
      lastStatus = String(response.status);
      await response.body?.cancel();
      if (response.status === 200) return await run(origin);
      await delay(100);
    }
    throw new Error(`Next.js did not become ready (last status: ${lastStatus}): ${logs}`);
  } finally {
    if (child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      await Promise.race([exited, delay(5_000)]);
      if (child.exitCode === null) child.kill("SIGKILL");
    }
  }
}

test("the production build rewrites public images using runtime RustFS settings", async (t) => {
  assert.ok(existsSync(".next/BUILD_ID"), "run npm run build before this test");

  for (const [name, body] of [["first", "first object"], ["second", "second object"]]) {
    await t.test(`uses the ${name} endpoint and strips sensitive headers`, async () => {
      const received = [];
      const upstream = createServer((request, response) => {
        received.push(request);
        response.writeHead(200, { "Content-Type": "image/jpeg", "Content-Length": Buffer.byteLength(body) });
        response.end(request.method === "HEAD" ? undefined : body);
      });
      const upstreamPort = await startServer(upstream);

      try {
        await withPortal({ endpoint: `http://127.0.0.1:${upstreamPort}` }, async (origin) => {
          const image = await fetch(`${origin}${basePath}?size=512`, {
            headers: { Cookie: "session=private", Authorization: "Bearer private", Accept: "image/jpeg" },
          });
          assert.equal(image.status, 200);
          assert.equal(image.headers.get("content-type"), "image/jpeg");
          assert.equal(await image.text(), body);
          assert.equal(received[0].url, `/acs-bucket-staging/public/profiles/52007765-d4de-4bb3-b964-5b39b4ada79d?size=512`);
          assert.equal(received[0].headers.cookie, undefined);
          assert.equal(received[0].headers.authorization, undefined);
          assert.equal(received[0].headers.accept, "image/jpeg");

          const head = await fetch(`${origin}${basePath}`, { method: "HEAD" });
          assert.equal(head.status, 200);
          assert.equal(await head.text(), "");

          assert.equal((await fetch(`${origin}/admin/auth`)).status, 200);
          const admin = await fetch(`${origin}/admin`, { redirect: "manual" });
          assert.equal(admin.status, 307);
          assert.equal(new URL(admin.headers.get("location"), origin).pathname, "/home");
        });
      } finally {
        await closeServer(upstream);
      }
    });
  }

  await t.test("rejects invalid paths and methods", async () => {
    await withPortal({ endpoint: "http://127.0.0.1:9" }, async (origin) => {
      assert.equal((await fetch(`${origin}/media/other-bucket/public/profiles/id`)).status, 404);
      assert.equal((await fetch(`${origin}/media/acs-bucket-staging/private/profiles/id`)).status, 404);
      assert.equal((await fetch(`${origin}/media/acs-bucket-staging/public/secrets/id`)).status, 404);
      assert.equal((await fetch(`${origin}/media/acs-bucket-staging/public/profiles/%2e%2e%2fprivate/id`)).status, 404);
      const post = await fetch(`${origin}${basePath}`, { method: "POST" });
      assert.equal(post.status, 405);
      assert.equal(post.headers.get("allow"), "GET, HEAD");
    });
  });

  await t.test("returns 503 when the runtime endpoint or bucket is missing", async () => {
    await withPortal({ endpoint: undefined }, async (origin) => {
      assert.equal((await fetch(`${origin}${basePath}`)).status, 503);
    });
    await withPortal({ endpoint: "http://127.0.0.1:9", bucket: null }, async (origin) => {
      const missingBucket = await fetch(`${origin}${basePath}`);
      assert.equal(missingBucket.status, 503, await missingBucket.text());
    });
  });
});
