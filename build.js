import { marked } from 'marked';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import * as path from 'path'; // We need 'path' for file utilities
const { JSDOM } = await import('jsdom');
// --- Setup ---
const postsDir = 'posts';       // Where your .md files are
const OUTPUT_FILENAME = 'blog.html'; // The name of the single file

/**
 * A helper function to get a title from a filename.
 * e.g., "my-first-post" -> "My First Post"
 */
function getTitleFromSlug(slug) {
    return slug.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * This is your main HTML template.
 * It takes the giant string of all posts and wraps it.
 */
function getPageTemplate(allPostsHtml) {
    return fs.readFile('blog_template.html', 'utf-8').then(template => {
        const dom = new JSDOM(template).window.document;
        dom.querySelector('main').innerHTML = allPostsHtml;
        return dom.documentElement.outerHTML;
    });
}

// --- Build Script Logic ---

async function buildSite() {
    console.log("Starting server-side build for single page...");

    // 1. Find all markdown files
    const mdFiles = glob.sync(`${postsDir}/*.md`);

    if (mdFiles.length === 0) {
        console.log("No markdown files found. Exiting.");
        return;
    }

    // This string will hold all of our post HTML
    let allPostsHtml = [];

    // 2. Loop through each file, parse it, and add to the string
    for (const file of mdFiles) {
        console.log(`Processing: ${file}`);

        const slug = path.basename(file, '.md');
        const title = getTitleFromSlug(slug);

        const markdown = await fs.readFile(file, 'utf-8');

        // Use marked to parse the file content
        const htmlContent = marked.parse(markdown);

        // Add this post to our master string
        allPostsHtml.push(`
<article class="blog-post" id="${slug}">
    <h2>${title}</h2>
    <div class="post-content">
        ${htmlContent}
    </div>
</article>
        `);
    }

    allPostsHtml = allPostsHtml.join('\n');

    // 3. Wrap all the post HTML in our main template
    const finalHtml = await getPageTemplate(allPostsHtml);

    // 4. Write the single, final HTML file
    await fs.writeFile(OUTPUT_FILENAME, finalHtml);

    console.log(`\nBuild complete!`);
    console.log(`All posts compiled into: ${OUTPUT_FILENAME}`);
}

// Run the build
buildSite();