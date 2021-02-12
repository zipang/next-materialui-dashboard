#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import gm from "gray-matter";
import tk from "terminal-kit";
import dot from "dot";
import { convertToHtml } from "../lib/services/MarkdownToHtml.js";

const { terminal } = tk;

const defaultTemplateSettings = Object.assign(dot.templateSettings, {
	varname: "data"
});

/**
 * dot functions are compiled as
 * @example
 *   function anonymous(it) {
 *     var out='';
 *     return out;
 *   }
 *
 * We transform them as arrow function : (data) => '...'
 * @param {Function} fn Compiled dot template
 * @param {Boolean} stripHTML Pass TRUE to remove all HTML tags (for the text template)
 */
const rewriteDotTemplate = (fn, stripHTML) =>
	fn
		.toString()
		.replace(
			`function anonymous(data
) {
var out=`,
			"(data) => ("
		)
		.replace(
			`;return out;
}`,
			");"
		)
		.replace(/\);$/, stripHTML ? `).replace(/(<([^>]+)>)/gi, "");` : ");");

/**
 * Webpack loader to load markdown file with dot syntax
 * @param {String} md
 */
const MarkdownTemplateLoader = (templateName, md, properties = {}) => {
	const textTemplate = dot.template(md, { ...defaultTemplateSettings, strip: false }); // Do not alter spaces and newlines in markdown !
	const html = convertToHtml(md);
	const htmlTemplate = dot.template(html, defaultTemplateSettings);

	// Each property in the front matter may be a dot template function too
	const propertiesSource = Object.keys(properties).reduce((code, propertyName) => {
		return (
			code +
			`
/**
 * Front matter ${propertyName}
 * @param {Object} data
 * @return {String}
 */
export const ${propertyName} = ${rewriteDotTemplate(
				dot.template(properties[propertyName], {
					...defaultTemplateSettings,
					strip: false
				})
			)}

`
		);
	}, "");
	const propertiesKeys = `,${Object.keys(properties).join(",\n\t")}`;

	const templateSource = `
// ${templateName}.js	

/**
 * Apply the data to the compiled TEXT template
 * @param {Object} data
 * @return {String}
 */
export const text = ${rewriteDotTemplate(textTemplate, true)};

/**
 * Apply the data to the compiled HTML template
 * @param {Object} data
 * @return {String}
 */
export const html = ${rewriteDotTemplate(htmlTemplate)};

${propertiesSource}

const ${templateName} = {
	text,
	html${propertiesKeys}
};

const render = (data) =>
	Object.keys(${templateName}).reduce((prev, key) => {
		prev[key] = ${templateName}[key](data);
		return prev;
	}, {});

export default render;
`;
	return templateSource;
};

export default MarkdownTemplateLoader;

/**
 * Command line
 */
const generation = async () => {
	// Chhose the markdown template
	terminal.cyan("Choose a Markdown template file (use TAB for completion): ");
	const markdownFile = await terminal.fileInput({
		baseDir: "../../content/templates",
		autoComplete: true
	});
	// Extract its name
	const templateName = path.basename(markdownFile, ".md");
	// Load its content and front-ammer with gray-matter
	const { data, content } = gm.read(markdownFile);

	// Report
	terminal.blue(`
Front matter data :
	${JSON.stringify(data)}
	`);
	terminal.green(`
Markdown content :
${content}`);

	// Generate the compiled js
	const fileSource = MarkdownTemplateLoader(templateName, content, data);

	// The generated JS will be located inside src/templates
	const destination = path.join(
		path.dirname(markdownFile),
		"../../../src/templates",
		path.basename(markdownFile).replace(/.md$/, ".js")
	);
	terminal.cyan(`Copying the JS template to :
${destination}
`);

	await fs.writeFile(destination, fileSource);
	terminal.green(`Template ${templateName}.js has been generated !
`);
};

(async function run() {
	try {
		await generation();
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
