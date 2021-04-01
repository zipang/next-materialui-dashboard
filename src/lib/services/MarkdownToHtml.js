import micromark from "micromark.js";
import combine from "micromark/dist/util/combine-extensions.js";
import combineHtml from "micromark/dist/util/combine-html-extensions.js";
import gfmTables from "micromark-extension-gfm-table.js";
import gfmTablesHtml from "micromark-extension-gfm-table/html.js";
import gfmAutoLinks from "micromark-extension-gfm-autolink-literal.js";
import gfmAutoLinksHtml from "micromark-extension-gfm-autolink-literal/html.js";

const _DEFAULT_OPTIONS = {
	allowDangerousHtml: true,
	extensions: combine([gfmTables, gfmAutoLinks]),
	htmlExtensions: combineHtml([gfmTablesHtml, gfmAutoLinksHtml])
};

// const serializer = remark().use(breaks).use(gfm).use(links).use(html);

/**
 * Convert GFM markdown text to HTML
 * @see https://github.github.com/gfm/
 * @param {String} md Markdown text
 * @param {Object}
 * @return {String} html converted version
 */
export const convertToHtml = (md, options) => {
	const startTime = Date.now();
	try {
		const html = micromark(md, { ..._DEFAULT_OPTIONS, ...options });
		const elapsed = Date.now() - startTime;
		console.log(`Markdown to HTML conversion took ${elapsed}ms :
${html}`);
		return html;
	} catch (err) {
		console.error(err);
		return `Conversion to HTML Failed : <code>${err.message}</code>`;
	}
};
