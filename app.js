import { createServer } from "http";
import path from "path";
import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";

const PORT = process.env.PORT || 3002;

const DATA_FILE = path.join("data", "links.json");

/**
 * Serve static files (HTML/CSS)
 */
const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await readFile(filePath);

    res.writeHead(200, {
      "Content-Type": contentType,
    });

    res.end(data);
  } catch (error) {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 Page Not Found");
  }
};

/**
 * Load all saved links from JSON file
 */
const loadLinks = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }

    throw error;
  }
};

/**
 * Save links back to JSON file
 */
const saveLinks = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links, null, 2));
};

/**
 * Validate URL format
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate custom shortcode
 * Allows letters, numbers, _ and -
 */
const isValidShortCode = (shortCode) => {
  return /^[a-zA-Z0-9_-]+$/.test(shortCode);
};

const server = createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // --------------------
  // GET REQUESTS
  // --------------------
  if (req.method === "GET") {
    // Serve home page
    if (req.url === "/") {
      return serveFile(
        res,
        path.join("public", "index.html"),
        "text/html"
      );
    }

    // Serve CSS file
    if (req.url === "/style.css") {
      return serveFile(
        res,
        path.join("public", "style.css"),
        "text/css"
      );
    }

    // Return all saved links
    if (req.url === "/links") {
      const links = await loadLinks();

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      return res.end(JSON.stringify(links));
    }

    // Handle short URL redirection
    const links = await loadLinks();
    const shortCode = req.url.slice(1);

    if (links[shortCode]) {
      res.writeHead(302, {
        Location: links[shortCode],
      });

      return res.end();
    }

    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    return res.end("Short URL not found");
  }

  // --------------------
  // CREATE SHORT URL
  // --------------------
  if (req.method === "POST" && req.url === "/shorten") {
    const links = await loadLinks();

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { url, shortCode } = JSON.parse(body);

        // URL required
        if (!url) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });

          return res.end("URL is required");
        }

        // Validate URL
        if (!isValidUrl(url)) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });

          return res.end("Invalid URL");
        }

        // Generate random shortcode if user doesn't provide one
        const finalShortCode =
          shortCode?.trim() ||
          crypto.randomBytes(4).toString("hex");

        // Validate shortcode
        if (!isValidShortCode(finalShortCode)) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });

          return res.end(
            "Shortcode can only contain letters, numbers, _ and -"
          );
        }

        // Prevent duplicate shortcode
        if (links[finalShortCode]) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });

          return res.end("Shortcode already exists");
        }

        // Save URL
        links[finalShortCode] = url;

        await saveLinks(links);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            shortCode: finalShortCode,
          })
        );
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Internal Server Error");
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});