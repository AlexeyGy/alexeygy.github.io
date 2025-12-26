This is my personal homepage hosted at alexeygy.github.io.

## How to build (for future self)

Run

```shell
node build.js
```

To build the blog, this turns all markdown files under blog into the blog page.

### Interactive build

```shell
node --watch --watch-path=posts --watch-path=build.js --watch-path=style.css --watch-path=blog_template.html build.js
```

This will watch for content changes and rebuild the blog automatically.

### Prereqs

Node with a couple packages.

```shell
npm install marked glob jsdom
```
