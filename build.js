import { marked } from "marked";
import * as fs from "fs/promises";
import { glob } from "glob";
import * as path from "path"; // We need 'path' for file utilities
const { JSDOM } = await import("jsdom");
// --- Setup ---
const postsDir = "posts"; // Where your .md files are
const OUTPUT_FILENAME = "blog.html"; // The name of the single file

// Regex to extract the first title from the markdown file
const FIRST_TITLE_REGEX = /^#\s(.*)\n/;

/**
 * This is your main HTML template.
 * It takes the giant string of all posts and wraps it.
 */
async function getPageTemplate(allPostsHtml, title = "Blog") {
  return fs.readFile("blog_template.html", "utf-8").then((template) => {
    const dom = new JSDOM(template).window.document;
    dom.querySelector("main").innerHTML = allPostsHtml;
    dom.querySelector("title").innerHTML = title;
    return dom.documentElement.outerHTML;
  });
}

// --- Build Script Logic ---

async function buildSite() {
  console.log("Starting server-side build for blog...");

  // 0. Cleanup blog directory
  await fs.rm("blog", { recursive: true, force: true });
  await fs.mkdir("blog");

  // 1. Find all markdown files
  const mdFiles = glob.sync(`${postsDir}/*.md`);

  if (mdFiles.length === 0) {
    console.log("No md files found. Exiting.");
    return;
  }

  let postLinks = [];

  // 2. Loop through each file, parse it, and add to the string
  for (const file of mdFiles) {
    console.log(`Processing: ${file}`);

    const slug = path.basename(file, ".md");

    const markdown = await fs.readFile(file, "utf-8");

    const title = markdown.match(FIRST_TITLE_REGEX)[1];

    // Use marked to parse the file content
    const htmlContent = marked.parse(markdown);

    // Create a directory for this post
    await fs.mkdir(`blog/${slug}`, { recursive: true });

    // Write the index.html inside that directory
    await fs.writeFile(
      `blog/${slug}/index.html`,
      await getPageTemplate(htmlContent, title)
    );

    // Add linkage to this post to our master string as a link
    postLinks.push(`
        <a class="blog-post-link" href="/blog/${slug}/">${title}</a>
        `);
  }

  // 3. Wrap all the post HTML in our main template
  const finalHtml = await getPageTemplate(
    `<h1>Blog</h1>${postLinks.join("\n")}`
  );

  // 4. Write the single, final HTML file
  await fs.writeFile(OUTPUT_FILENAME, finalHtml);

  console.log(`All posts compiled into: ${OUTPUT_FILENAME}`);
}

// Run the build
buildSite();
