import { createServer } from "http";
import path from "path";
import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";

const PORT = 3002;
const data_file = path.join("data", "links.json");

const serverFile = async (res, filePath, contentType) => {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 page not found");
  }
};

const loadLinks = async () => {
  try {
    const data = await readFile(data_file, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(data_file, JSON.stringify({}));
      return {};
    }
    throw error;
  }
};

const saveLinks = async (links) => {
  await writeFile(data_file, JSON.stringify(links));
};

const server = createServer(async (req, res) => {
  console.log(req.url);

  if (req.method === "GET") {
    if (req.url === "/") {
      return serverFile(res, path.join("public", "index.html"), "text/html");
    } else if (req.url === "/style.css") {
      return serverFile(res, path.join("public", "style.css"), "text/css");
    } else if (req.url === "/links") {
      const links = await loadLinks();

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(links));
    } else {
      const links = await loadLinks();
      const shortCode = req.url.slice(1);
      console.log("link redirect", req.url);

      if (links[shortCode]) {
        res.writeHead(302, { location: links[shortCode] });
        return res.end();
      }

      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("url is not found");
    }
  }

  if (req.method === "POST" && req.url === "/shorten") {
    const links = await loadLinks();

    let body = "";
    req.on("data", (chunk) => {
      body = body + chunk;
    });
    req.on("end", async () => {
      console.log(body);
      const { url, shortCode } = JSON.parse(body);

      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("url is required");
      }
      const finalShortcode = shortCode || crypto.randomBytes(4).toString("hex");

      if (links[finalShortcode]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("short code exists");
      }

      links[finalShortcode] = url;

      await saveLinks(links);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ shortCode: finalShortcode }));
    });
  }
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
