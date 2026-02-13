/**
 * Parses WordPress WXR export and outputs JSON for the blog system.
 * Run: node scripts/parse-wordpress.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const XML_PATH = path.join(process.cwd(), 'blog.WordPress.2026-02-12.xml');
const OUTPUT_PATH = path.join(process.cwd(), 'content', 'blog-posts.json');

function extractTag(content, tagName, useCData = true) {
  const pattern = useCData
    ? new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[(.*?)\\]\\]></${tagName}>`, 's')
    : new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`);
  const match = content.match(pattern);
  return match ? match[1].trim() : '';
}

function buildAttachmentMap(xml) {
  // Build a map of post_id -> attachment_url for all attachment items
  const map = {};
  const itemBlocks = xml.split(/<item>/).slice(1);

  for (const block of itemBlocks) {
    const item = '<item>' + block.split('</item>')[0] + '</item>';
    const postType = extractTag(item, 'wp:post_type');
    if (postType !== 'attachment') continue;

    const postId = item.match(/<wp:post_id>(\d+)<\/wp:post_id>/)?.[1];
    const urlMatch = item.match(/<wp:attachment_url><!\[CDATA\[(.*?)\]\]><\/wp:attachment_url>/);
    if (postId && urlMatch) {
      map[postId] = urlMatch[1];
    }
  }

  return map;
}

function extractFirstImage(content) {
  // Try to extract first <img> src from content
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match ? match[1] : '';
}

function parseWordPressXML(xml) {
  const attachmentMap = buildAttachmentMap(xml);
  console.log(`Built attachment map with ${Object.keys(attachmentMap).length} entries`);

  const posts = [];
  const itemBlocks = xml.split(/<item>/).slice(1);

  for (const block of itemBlocks) {
    const item = '<item>' + block.split('</item>')[0] + '</item>';

    const postType = extractTag(item, 'wp:post_type');
    if (postType && postType !== 'post') continue;

    const title = extractTag(item, 'title');
    const link = item.match(/<link>([^<]+)<\/link>/)?.[1] || '';
    const content = extractTag(item, 'content:encoded');
    const excerpt = extractTag(item, 'excerpt:encoded');
    const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] || '';
    const creator = extractTag(item, 'dc:creator');
    const postName = extractTag(item, 'wp:post_name');
    const modified = extractTag(item, 'wp:post_modified');

    let slug = postName || link.replace(/\/$/, '').split('/').pop() || '';

    const categoryMatches = [...item.matchAll(/<category domain="category"[^>]*><!\[CDATA\[([^\]]+)\]\]><\/category>/g)];
    const categories = categoryMatches.map(m => m[1]);

    const metaDescMatch = item.match(/_yoast_wpseo_metadesc[^<]*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/s);
    const metaDescription = metaDescMatch?.[1] || '';

    // Extract featured image via _thumbnail_id
    const thumbnailMatch = item.match(/_thumbnail_id[\s\S]*?<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/);
    const thumbnailId = thumbnailMatch?.[1];
    let featuredImage = thumbnailId ? (attachmentMap[thumbnailId] || '') : '';

    // Fallback: first image in content
    if (!featuredImage) {
      featuredImage = extractFirstImage(content);
    }

    const excerptText = excerpt || content.replace(/<[^>]+>/g, '').slice(0, 300) + '...';

    posts.push({
      slug,
      title: title || 'Untitled',
      excerpt: excerptText,
      content,
      date: pubDate,
      modified,
      author: creator || 'Marketing Mojito',
      categories,
      featuredImage,
      metaDescription: metaDescription || undefined,
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function main() {
  console.log('Reading WordPress export...');
  const xml = fs.readFileSync(XML_PATH, 'utf-8');

  console.log('Parsing posts...');
  const posts = parseWordPressXML(xml);
  console.log(`Found ${posts.length} blog posts`);
  console.log(`Posts with featured images: ${posts.filter(p => p.featuredImage).length}`);

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Saved to ${OUTPUT_PATH}`);
}

main();
