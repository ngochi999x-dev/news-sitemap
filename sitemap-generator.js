const fetch = require('node-fetch');

const BLOGGER_FEED_URL = 'https://YOUR_BLOGGER_BLOG_ID.blogspot.com/feeds/posts/default?alt=json';
const SITEMAP_XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1">';
const SITEMAP_XML_FOOTER = '\n</urlset>';  

async function fetchBloggerFeed() {
    const response = await fetch(BLOGGER_FEED_URL);
    const data = await response.json();
    return data.feed.entry;
}

function generateSitemap(entries) {
    const urlEntries = entries.map(entry => {
        const title = entry.title.$t;
        const link = entry.link.find(link => link.rel === 'alternate').href;
        const published = entry.published.$t;
        return `  <url>\n    <loc>${link}</loc>\n    <news:news>\n      <news:publication>\n        <news:name>Your Blog Name</news:name>\n      </news:publication>\n      <news:publication_date>${published}</news:publication_date>\n    </news:news>\n  </url>`;
    });

    return SITEMAP_XML_HEADER + '\n' + urlEntries.join('\n') + '\n' + SITEMAP_XML_FOOTER;
}

async function generateSitemapFile() {
    const entries = await fetchBloggerFeed();
    const sitemap = generateSitemap(entries);
    console.log(sitemap);
}

generateSitemapFile();
