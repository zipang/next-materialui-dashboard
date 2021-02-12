#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const gm = require("gray-matter");
const tk = require("terminal-kit");
const dot = require("dot");
import { convertToHtml } from "../src/lib/services/MarkdownToHtml.js";

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
			`function anonymous(data
) {
var out=`,
			"(data) => "
		)
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
	const textTemplate = dot(md, {
		strip: false, // Don't strip whitespaces in markdown !
		varname: "data",
		encode: false
	});
	const html = convertToHtml(md);
	const htmlTemplate = dot(html, { varname: "data", encode: false });

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
export const ${propertyName} = ${rewriteDotTemplate(dot(properties[propertyName]))}

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

module.exports = MarkdownTemplateLoader;

/**
 * Command line
 */
const generation = async () => {
	// Choose the markdown template
	terminal.cyan("Choose a Markdown template file (use TAB for completion): ");
	const markdownFile = await terminal.fileInput({
		baseDir: path.join(__dirname, "../content/templates"),
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
		__dirname,
		"../src/templates",
		path.basename(markdownFile).replace(/.md$/, ".js")
	);
	terminal.cyan(`Copying the JS template to :
${destination}
`);

	await fs.writeFile(destination, fileSource);
	terminal.green(`Template ${templateName}.js has been generated !
`);
};

require.main !== module &&
	(async function run() {
		try {
			await generation();
			process.exit(0);
		} catch (err) {
			console.error(err);
			process.exit(1);
		}
	})();
