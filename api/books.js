const GOODREADS_USER_ID = '169945300';
const SHELVES = ['currently-reading', 'read', 'to-read'];

async function fetchWithTimeout(url, options, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetries(url, options) {
  const timeouts = [3000, 5000, 8000];
  let lastError;

  for (let i = 0; i < timeouts.length; i++) {
    try {
      const response = await fetchWithTimeout(url, options, timeouts[i]);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (error.name !== 'AbortError') break;
      if (i < timeouts.length - 1) await wait(500);
    }
  }

  throw lastError;
}

function parseBooksFromXml(xml) {
  const books = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const getTag = (tag) => {
      const m = item.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
      if (m) return m[1].trim();
      const m2 = item.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m2 ? m2[1].trim() : '';
    };

    const title = getTag('title');
    const author = getTag('author_name');
    const link = getTag('link');
    const rating = getTag('user_rating');
    const bookId = getTag('book_id');

    if (title) {
      books.push({
        title,
        author,
        link,
        rating: parseInt(rating, 10) || 0,
        bookId
      });
    }
  }

  return books;
}

async function fetchShelf(shelf) {
  const url = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${shelf}`;
  const response = await fetchWithRetries(url, {
    headers: { 'Accept': 'application/xml' }
  });
  const xml = await response.text();
  return parseBooksFromXml(xml);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const results = await Promise.allSettled(
      SHELVES.map(shelf => fetchShelf(shelf))
    );

    const shelves = {};
    SHELVES.forEach((shelf, i) => {
      shelves[shelf] = results[i].status === 'fulfilled' ? results[i].value : [];
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).json({
      shelves,
      success: true
    });
  } catch (error) {
    console.error('Failed to fetch books:', error);
    res.setHeader('Cache-Control', 'no-store');

    return res.status(500).json({
      shelves: { 'currently-reading': [], 'read': [], 'to-read': [] },
      success: false,
      error: 'Failed to fetch books from Goodreads'
    });
  }
}
