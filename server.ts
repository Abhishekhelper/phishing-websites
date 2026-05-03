import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Redirection Check
  app.get("/api/check-redirect", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      // Clean defanged URLs (e.g., hlinfos[.]link -> hlinfos.link)
      const cleanedUrl = targetUrl.replace(/\[\.\]/g, '.').replace(/\[/g, '').replace(/\]/g, '').trim();
      const formattedUrl = cleanedUrl.startsWith('http') ? cleanedUrl : `https://${cleanedUrl}`;
      
      // Validate URL before fetching
      let urlObj;
      try {
        urlObj = new URL(formattedUrl);
      } catch (e) {
        return res.json({
          error: "Invalid URL format",
          isRedirected: false,
          isCrossDomainRedirect: false
        });
      }

      const response = await fetch(formattedUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000), 
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const finalUrl = response.url;
      const initialDomain = urlObj.hostname.replace('www.', '');
      const finalDomain = new URL(finalUrl).hostname.replace('www.', '');
      
      const isCrossDomainRedirect = initialDomain !== finalDomain;

      res.json({
        initialUrl: formattedUrl,
        finalUrl: finalUrl,
        isRedirected: formattedUrl !== finalUrl,
        isCrossDomainRedirect,
        status: response.status
      });
    } catch (error) {
      console.error("Redirect check failed:", error);
      res.json({
        error: "Connection failed or timeout",
        isRedirected: false,
        isCrossDomainRedirect: false
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
