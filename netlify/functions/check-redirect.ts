import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
    };
  }

  try {
    // Clean defanged URLs
    const cleanedUrl = targetUrl.replace(/\[\.\]/g, '.').replace(/\[/g, '').replace(/\]/g, '').trim();
    const formattedUrl = cleanedUrl.startsWith('http') ? cleanedUrl : `https://${cleanedUrl}`;
    
    const urlObj = new URL(formattedUrl);

    const response = await fetch(formattedUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const finalUrl = response.url;
    const initialDomain = urlObj.hostname.replace('www.', '');
    const finalDomain = new URL(finalUrl).hostname.replace('www.', '');
    
    const isCrossDomainRedirect = initialDomain !== finalDomain;

    return {
      statusCode: 200,
      body: JSON.stringify({
        initialUrl: formattedUrl,
        finalUrl: finalUrl,
        isRedirected: formattedUrl !== finalUrl,
        isCrossDomainRedirect,
        status: response.status
      }),
    };
  } catch (error) {
    console.error("Redirect check failed:", error);
    return {
      statusCode: 200, // Still return 200 so the frontend handles the "connection failed" gracefully
      body: JSON.stringify({
        error: "Connection failed or timeout",
        isRedirected: false,
        isCrossDomainRedirect: false
      }),
    };
  }
};
