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

export default ${templateName};
`;
	return templateSource;
};

export default MarkdownTemplateLoader;

/**
 * Command line
 */
const generation = async () => {
	terminal.cyan("Choose a Markdown template file (use TAB for completion): ");
	const filename = await terminal.fileInput({
		baseDir: "../templates",
		autoComplete: true
	});
	const templateName = path.basename(filename, ".md");

	const { data, content } = gm.read(filename);
	terminal.blue(`
Front matter data :
	${JSON.stringify(data)}
	`);
	terminal.green(`
Markdown content :
${content}`);
	const fileSource = MarkdownTemplateLoader(templateName, content, data);
	const destination = filename.replace(/.md$/, ".js");

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
