const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

// Fetch Blogger feed
const BLOGGER_FEED_URL = 'https://celebritynewz36.blogspot.com/feeds/posts/default?alt=json&max-results=50';
const OUTPUT_FILE = 'sitemap.xml';

async function generateSitemap() {
    try {
        const response = await axios.get(BLOGGER_FEED_URL);
        const posts = response.data.feed.entry || [];
        const now = moment();
        const twoDaysAgo = moment().subtract(48, 'hours');

        // Filter posts from the last 48 hours
        const recentPosts = posts.filter(post => {
            const publishedDate = moment(post.published.$t);
            return publishedDate.isAfter(twoDaysAgo);
        });

        // Generate XML structure
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-image/1.1">\n';

        recentPosts.forEach(post => {
            const title = post.title.$t;
            const url = post.link.find(link => link.rel === 'alternate').href;
            const publicationDate = post.published.$t;

            xml += '  <url>\n';
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <news:news>\n`;
            xml += `      <news:publication>\n`;
            xml += `        <news:name>${title}</news:name>\n`;
            xml += `        <news:language>en</news:language>\n`;
            xml += `      </news:publication>\n`;
            xml += `      <news:publication_date>${publicationDate}</news:publication_date>\n`;
            xml += `    </news:news>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        // Output the XML to a file
        fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
        console.log('Sitemap generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();