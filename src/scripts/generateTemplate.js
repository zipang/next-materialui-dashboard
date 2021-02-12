#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import gm from "gray-matter";
import tk from "terminal-kit";
import dot from "dot";
import { convertToHtml } from "../lib/services/MarkdownToHtml.js";

const { terminal } = tk;

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
 */
const rewriteDotTemplate = (fn) =>
	fn
		.toString()
		.replace(
			`function anonymous(it
) {
var out=`,
			"(data) => "
		)
		.replace(/it\./g, "data.")
		.replace(
			`;return out;
}`,
			";"
		);

/**
 * Webpack loader to load markdown file with dot syntax
 * @param {String} md
 */
const MarkdownTemplateLoader = (templateName, md, properties = {}) => {
	const textTemplate = dot.compile(md);
	const html = convertToHtml(md);
	const htmlTemplate = dot.compile(html);

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
				dot.compile(properties[propertyName])
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
export const text = ${rewriteDotTemplate(textTemplate)};

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
