const MAX_HTML_BYTES = 180000;
const FETCH_TIMEOUT_MS = 4500;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9'
};

const EMPTY_PREVIEW = {
  ok: false,
  embeddable: false,
  image: null,
  title: '',
  description: '',
  siteName: '',
  themeColor: ''
};

// Blocks requests that would make the serverless function probe the private network.
function isPublicHttpUrl(url) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  const host = url.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === '[::1]' ||
    host === '0.0.0.0'
  ) {
    return false;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number);
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
  }

  return true;
}

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

// Meta tags live in <head>, so stop as soon as it closes instead of downloading whole pages.
async function readHead(response) {
  const body = response.body;
  if (!body || typeof body.getReader !== 'function') {
    const text = await response.text();
    return text.slice(0, MAX_HTML_BYTES);
  }

  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let html = '';
  let bytes = 0;

  try {
    while (bytes < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      html += decoder.decode(value, { stream: true });
      if (/<\/head>/i.test(html)) break;
    }
  } finally {
    reader.cancel().catch(() => {});
  }

  return html;
}

function decodeEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function parseMeta(html) {
  const meta = {};
  const tags = html.match(/<meta\b[^>]*>/gi) || [];

  tags.forEach((tag) => {
    const key = tag.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)["']/i);
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);
    if (!key || !content) return;
    const name = key[1].toLowerCase();
    if (!meta[name]) meta[name] = decodeEntities(content[1]);
  });

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) meta.__title = decodeEntities(title[1]);

  return meta;
}

function pick(meta, keys) {
  for (const key of keys) {
    if (meta[key]) return meta[key];
  }
  return '';
}

function absoluteUrl(value, base) {
  if (!value) return null;
  try {
    const resolved = new URL(value, base);
    return resolved.protocol === 'http:' || resolved.protocol === 'https:'
      ? resolved.toString()
      : null;
  } catch {
    return null;
  }
}

// A site is framable unless it opts out via X-Frame-Options or CSP frame-ancestors.
function isEmbeddable(headers) {
  const xfo = (headers.get('x-frame-options') || '').toLowerCase();
  if (xfo) return false;

  const csp = (headers.get('content-security-policy') || '').toLowerCase();
  const ancestors = csp.match(/frame-ancestors([^;]*)/);
  if (ancestors) {
    const value = ancestors[1].trim();
    if (!/(^|\s)(\*|https:)(\s|$)/.test(value)) return false;
  }

  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const target = req.query?.url;
  let parsed;
  try {
    parsed = new URL(Array.isArray(target) ? target[0] : target);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ ...EMPTY_PREVIEW, error: 'Invalid url' });
  }

  if (!isPublicHttpUrl(parsed)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ ...EMPTY_PREVIEW, error: 'Unsupported url' });
  }

  try {
    const response = await fetchWithTimeout(parsed.toString());
    const finalUrl = response.url || parsed.toString();
    const embeddable = response.ok && isEmbeddable(response.headers);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();

    // Cache aggressively: framing rules and social cards rarely change.
    res.setHeader(
      'Cache-Control',
      's-maxage=86400, stale-while-revalidate=604800'
    );

    if (!contentType.includes('html')) {
      return res.status(200).json({
        ...EMPTY_PREVIEW,
        ok: response.ok,
        url: parsed.toString(),
        finalUrl,
        embeddable,
        image: contentType.startsWith('image/') ? finalUrl : null
      });
    }

    const meta = parseMeta(await readHead(response));

    return res.status(200).json({
      ok: true,
      url: parsed.toString(),
      finalUrl,
      embeddable,
      image: absoluteUrl(
        pick(meta, [
          'og:image:secure_url',
          'og:image',
          'twitter:image',
          'twitter:image:src'
        ]),
        finalUrl
      ),
      title: pick(meta, ['og:title', 'twitter:title']) || meta.__title || '',
      description: pick(meta, [
        'og:description',
        'twitter:description',
        'description'
      ]),
      siteName: pick(meta, ['og:site_name', 'application-name']),
      themeColor: pick(meta, ['theme-color'])
    });
  } catch (error) {
    console.error('Preview fetch failed:', parsed.hostname, error.message);

    // Short cache on failures so a flaky site does not retry on every hover.
    res.setHeader('Cache-Control', 's-maxage=300');

    return res.status(200).json({
      ...EMPTY_PREVIEW,
      url: parsed.toString(),
      finalUrl: parsed.toString(),
      error: error.name === 'AbortError' ? 'Preview timed out' : 'Preview failed'
    });
  }
}
