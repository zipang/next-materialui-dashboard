#!/usr/bin/env node

import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import gm from "gray-matter";
import tk from "terminal-kit";
import dot from "dot";
import { convertToHtml } from "../lib/services/MarkdownToHtml.js";
import FileWalker from "../lib/utils/FileWalker.js";
import { isMarkdown } from "../lib/utils/VFile.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { terminal } = tk;

const defaultTemplateSettings = Object.assign(dot.templateSettings, {
	varname: "data"
});

/**
 * dot functions are compiled as
 * @example
 *   function anonymous(data) {
 *     var out='';
 *     return out;
 *   }
 *
 * We replace every property access like `data.prop[1].propX`
 * that may fail with `getProperty(data, "prop[1].propX", "")`
 * So that it will return an empty space if the property is missing
 * @param {Function} fn Compiled dot template
 * @param {Boolean} stripHTML Pass TRUE to remove all HTML tags (for the text template)
 * @return {String}
 */
const rewriteDotTemplate = (fn, stripHTML) =>
	fn
		.toString()
		.replace(
			/\(data\.[^\(\)]+/g,
			(capture) =>
				` (getProperty(data, "${capture.substr(6).replace("?", "")}", "")`
		)
		.replace(
			"return out;",
			stripHTML ? `return out.replace(/(<([^>]+)>)/gi, "");` : "return out;"
		);
// ;

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
		try {
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
		} catch (err) {
			return code;
		}
	}, "");

	const propertiesKeys = `,${Object.keys(properties).join(",\n\t")}`;

	const templateSource = `
// ${templateName}.js	
const splitPath = (path = "") => path.split(/[,\\[\\]\\.]+?/).filter(Boolean);

/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
 */
const getProperty = (source = {}, path = "", defaultValue) => {
	const result = splitPath(path).reduce(
		(result, key) => (result !== null && result !== undefined ? result[key] : result),
		source
	);

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};

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
 * Generate the JS template from its markdown source
 * The JS template exports two methods : `html()` and `text()`
 * @param {String} templateDir path to the directory root of all templates
 * @param {String} markdownFile root-relative path to the markdown + front-matter template source
 * @param {String} destinationDir path to the directory to wxrite the js template
 */
const generation = async (templateDir, markdownFile, destinationDir) => {
	console.log(`JS Template re-generation :
${markdownFile}`);
	// Extract its name
	const templateName = path.basename(markdownFile, ".md").replace(/[^a-zA-Z0-9]/g, "_");
	// Load its content and front-matter with gray-matter
	const { data, content } = gm.read(path.join(templateDir, markdownFile));

	// Report
	terminal.blue(`
Front matter data :
	${JSON.stringify(data)}
	`);
	terminal.green(`
Markdown content :
${content}`);

	// Generate the compiled js
	const renderCode = MarkdownTemplateLoader(templateName, content, data);

	// The generated JS will be located inside destinationDir
	const jsTemplateFile = path.join(
		destinationDir,
		path.basename(markdownFile).replace(/.md$/, ".js")
	);
	terminal.cyan(`Copying the JS template to :
${jsTemplateFile} (${renderCode.length}bytes)
`);

	await fs.writeFile(jsTemplateFile, renderCode);
	terminal.green(`Template ${templateName}.js has been generated !
`);
};

(async function run() {
	try {
		const templateDir = path.join(__dirname, "../../content/templates");
		const jsFilesDir = path.join(__dirname, "../templates");
		const walk = new FileWalker(templateDir).filterFiles(isMarkdown);

		const generationJobs = [];

		walk.on("file", (filePath) => {
			console.log(`Pushing ${filePath} job to the queue..`);
			generationJobs.push(generation(templateDir, filePath, jsFilesDir));
		})
			.on("end", async () => {
				console.log(`We have ${generationJobs.length} jobs pending..`);
				await Promise.all(generationJobs);
				process.exit(0);
			})
			.explore();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
