import { suite } from "uvu";
import code from "@hapi/code";
import { convertToHtml } from "./MarkdownToHtml.js";

const { expect } = code;

const MarkdownToHtmlTestSuite = suite("Markdown to HTML conversion");

const markdownText = `
# Hello Markdown GFM

Convert *Markdown GFM* syntax to HTML.
Line-breaks are generated without the need of two spaces (\`'  '\`) at the end of each lines.

Links like this one >> https://github.github.com/gfm/ << are automatically converted to hyperlinks.

Cat images can be inserted.
![Niam](https://media3.giphy.com/media/22kxQ12cxyEww/source.gif)

## References

* [The original Markdown post by John Gruber](https://daringfireball.net/projects/markdown/)

`;

MarkdownToHtmlTestSuite("Conversion", async () => {
	const html = await convertToHtml(markdownText);

	console.log("Converted Markdown text", html);

	expect(html).to.contain([
		`<h1>Hello Markdown GFM</h1>`,
		"<h2>References</h2>",
		`href="https://github.github.com/gfm/"`,
		`alt="Niam"`
	]);
	expect(html).to.not.contain("<h3>");
});

export default MarkdownToHtmlTestSuite;
