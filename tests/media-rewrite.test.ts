import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:http";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";

const basePath = "/media/acs-bucket-staging/public/profiles/52007765-d4de-4bb3-b964-5b39b4ada79d";

type PortalOptions = {
  endpoint?: string;
  bucket?: string | null;
  apiUrl?: string;
};

async function startServer(server: import("node:http").Server): Promise<number> {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server has no TCP address");
  return address.port;
}

async function closeServer(server: import("node:http").Server): Promise<void> {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => error ? reject(error) : resolve()),
  );
}

async function freePort(): Promise<number> {
  const server = createServer();
  const port = await startServer(server);
  await closeServer(server);
  return port;
}

async function withPortal(
  { endpoint, bucket = "acs-bucket-staging", apiUrl = "http://127.0.0.1:1" }: PortalOptions,
  run: (origin: string) => Promise<unknown>,
): Promise<unknown> {
  const port = await freePort();
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NODE_ENV: "production",
    API_URL: apiUrl,
    PORT: String(port),
    RUSTFS_READ_ENDPOINT: endpoint ?? "",
    RUSTFS_BUCKET: bucket ?? "",
  };

  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
    cwd: process.cwd(),
    env,
    stdio: ["ignore", "pipe", "pipe"] as const,
  });
  let logs = "";
  child.stdout.setEncoding("utf8").on("data", (chunk: string) => { logs += chunk; });
  child.stderr.setEncoding("utf8").on("data", (chunk: string) => { logs += chunk; });

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
        lastStatus = error instanceof Error ? error.message : String(error);
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
      const received: import("node:http").IncomingMessage[] = [];
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
          const location = admin.headers.get("location");
          assert.ok(location);
          assert.equal(new URL(location, origin).pathname, "/home");
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

  await t.test("forwards each SSR request cookie only to that request's feature calls", async () => {
    const received: Array<{
      url: string;
      cookie: string | string[] | undefined;
      authorization: string | string[] | undefined;
    }> = [];
    const api = createServer((request, response) => {
      received.push({ url: request.url ?? "", cookie: request.headers.cookie, authorization: request.headers.authorization });
      response.setHeader("Content-Type", "application/json");
      const path = new URL(request.url ?? "/", "http://localhost").pathname;
      if (path === "/api/v1/users/profile") {
        response.end(JSON.stringify({ data: {
          id: 1, email: "admin@example.com", firstNameTh: "ผู้ดูแล", lastNameTh: "ระบบ", roles: [{ id: 1, name: "Admin" }],
        } }));
      } else if (path === "/api/v1/master-data") {
        response.end(JSON.stringify({ data: {
          roles: [], typeCourses: [], tagsGroups: [], tags: [], prefixes: [], newsCategories: [],
        } }));
      } else if (path.startsWith("/api/v1/news/") || path.startsWith("/api/v1/curriculums")) {
        response.end(JSON.stringify({ data: { rows: [], totalRecords: 0, page: 1, pageSize: 12 } }));
      } else {
        response.writeHead(404).end(JSON.stringify({ message: "unhandled API path" }));
      }
    });
    const apiPort = await startServer(api);

    try {
      await withPortal({ apiUrl: `http://127.0.0.1:${apiPort}` }, async (origin) => {
        const [alice, bob, publicNews] = await Promise.all([
          fetch(`${origin}/admin/news`, { headers: { Cookie: "session=alice", Authorization: "Bearer app-secret" } }),
          fetch(`${origin}/admin/news`, { headers: { Cookie: "session=bob", Authorization: "Bearer app-secret" } }),
          fetch(`${origin}/news`),
        ]);
        assert.deepEqual([alice.status, bob.status, publicNews.status], [200, 200, 200]);

        for (const session of ["alice", "bob"]) {
          assert.ok(received.some((request) => request.url.startsWith("/api/v1/users/profile") && request.cookie === `session=${session}`));
          assert.ok(received.some((request) => request.url.startsWith("/api/v1/news/") && request.cookie === `session=${session}`));
          assert.ok(received.some((request) => request.url.startsWith("/api/v1/master-data") && request.cookie === `session=${session}`));
        }
        assert.ok(received.some((request) => request.url.startsWith("/api/v1/news/") && request.cookie === undefined));
        assert.ok(received.every((request) => request.authorization === undefined));
      });
    } finally {
      await closeServer(api);
    }
  });
});
