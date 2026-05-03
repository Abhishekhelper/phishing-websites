import { ClassificationResult, ClassificationReport, AnalysisFeature } from "../types";

/**
 * Extracts basic URL features to be used as antecedents for associative classification.
 */
function extractBasicFeatures(url: string): AnalysisFeature[] {
  const features: AnalysisFeature[] = [];
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname;

    // Feature 1: IP Address in URL
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const hasIp = ipRegex.test(hostname);
    features.push({
      name: 'IP Address Check',
      value: hasIp ? 'Hostname is an IP' : 'Hostname is a Domain',
      isRisk: hasIp,
      description: 'Phishing sites often use IP addresses to bypass domain-based blacklists.'
    });

    // Feature 2: Length of URL
    const isLong = url.length > 75;
    features.push({
      name: 'URL Length',
      value: url.length,
      isRisk: isLong,
      description: 'Attackers use long URLs to hide the suspicious part of the URL.'
    });

    // Feature 3: Number of subdomains
    const subdomains = hostname.split('.').length - 2;
    features.push({
      name: 'Subdomain Count',
      value: subdomains,
      isRisk: subdomains > 2,
      description: 'Extensive subdomains are often used to mimic legitimate bank structures (e.g., bank.com.login.security).'
    });

    // Feature 4: Contains Hyphens
    const hasHyphen = hostname.includes('-');
    features.push({
      name: 'Hyphen Check',
      value: hasHyphen ? 'Contains Hyphens' : 'No Hyphens',
      isRisk: hasHyphen,
      description: 'Legitimate banks rarely use hyphens in their main domain name.'
    });

    // Feature 5: Protocol Check
    const isHttps = url.startsWith('https');
    features.push({
      name: 'Protocol Security',
      value: isHttps ? 'HTTPS' : 'HTTP',
      isRisk: !isHttps,
      description: 'Most E-banking sites strictly use HTTPS.'
    });

  } catch (e) {
    features.push({
      name: 'URL Validity',
      value: 'Invalid URL',
      isRisk: true,
      description: 'The provided URL could not be parsed correctly.'
    });
  }
  return features;
}

export async function detectPhishing(url: string): Promise<ClassificationReport> {
  const basicFeatures = extractBasicFeatures(url);
  
  // Check for redirects via proxy
  let redirectInfo = null;
  try {
    const redirectRes = await fetch(`/api/check-redirect?url=${encodeURIComponent(url)}`);
    if (redirectRes.ok) {
        redirectInfo = await redirectRes.json();
        
        if (redirectInfo.isRedirected) {
            basicFeatures.push({
                name: 'URL Redirection',
                value: redirectInfo.isCrossDomainRedirect ? 'Cross-Domain Redirect Detected' : 'Internal Redirect Detected',
                isRisk: redirectInfo.isCrossDomainRedirect,
                description: `The URL redirects to: ${redirectInfo.finalUrl}. Cross-domain redirects are a high-risk indicator for phishing.`
            });
        }
    }
  } catch (err) {
    console.error("Failed to check redirects", err);
  }
  
  const systemInstruction = `
    You are an expert Cybersecurity Analyst specializing in E-banking Phishing Detection.
    You use an "Associative Classification" approach. 
    1. Identify hidden features (antecedents) in the URL and hostname.
    2. Map these features to known phishing association rules.
    3. Classify the website as PHISHING, LEGITIMATE, or SUSPICIOUS.
    
    Provide your response in strict JSON format.
  `;

  const prompt = `
    Analyze the following URL for E-banking phishing risks:
    URL: ${url}
    
    Pre-extracted Basic Features:
    ${basicFeatures.map(f => `${f.name}: ${f.value} (Risk: ${f.isRisk})`).join('\n')}
    
    Evaluate deeper features like:
    - Redirection info provided in Basic Features (if any)
    - Keywords (e.g., 'login', 'verify', 'update', 'secure', bank names)
    - TLD reputation (.xyz, .top, .online, etc.)
    - Character obfuscation (homoglyphs)
    - Presence of '@' symbol or '//' in path
    
    Explain your decision based on the association between these features and common phishing traits.
  `;

  // Call the backend API instead of calling Gemini directly
  const response = await fetch('/api/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, basicFeatures, prompt, systemInstruction })
  });

  if (!response.ok) {
    throw new Error('Analysis failed at server level');
  }

  const rawData = await response.json();
  
  return {
    url,
    result: rawData.result as ClassificationResult,
    confidence: rawData.confidence,
    riskScore: rawData.riskScore,
    features: [...basicFeatures, ...rawData.advancedFeatures],
    reasoning: rawData.reasoning,
    timestamp: new Date().toISOString()
  };
}
