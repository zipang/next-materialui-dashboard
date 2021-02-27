#!/usr/bin/env node

import fs from "fs-extra";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import tk from "terminal-kit";
import FileWalker from "../lib/utils/FileWalker.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runSingleTest = async (sourceFile) => {
	try {
		const testSuite = await import(path.join("..", sourceFile));
		const run = new Promise((resolve, reject) => {
			testSuite.default.after(resolve);
			testSuite.default.run();
		});

		return run;
	} catch (err) {
		tk.terminal.red(`Test suite ${sourceFile} throwed an error : ${err.message}`);
	}
};

(async function runTests() {
	const messages = [];
	try {
		console.log = (...msgs) => messages.push(...msgs);
		const sourceDir = path.join(__dirname, "..");
		const walk = new FileWalker(sourceDir).filterFiles((vfile) =>
			vfile.path.endsWith(".spec.js")
		);

		const testJobs = [];
		await new Promise(async (resolve, reject) => {
			await walk
				.on("file", (testFile) => {
					testJobs.push(runSingleTest(testFile));
					tk.terminal.green(`Loaded Test '${testFile}'` + "\n");
				})
				.on("end", async () => {
					tk.terminal.yellow(`We have ${testJobs.length} test jobs pending..`);
					resolve(true);
				})
				.on("error", (err) => {
					tk.terminal.red(err.message || err);
					reject(err);
				})
				.explore();
		});

		// Count failed test suites
		const allDone = await Promise.allSettled(testJobs);
		const failed = allDone.reduce(
			(fails, result) => (result.status === "rejected" ? fails + 1 : fails),
			0
		);
		if (failed === 0) {
			tk.terminal.green("Great Success. All tests passed !");
		} else {
			tk.terminal.yellow(`Some tests failed (${failed}/${allDone.length})!`);
		}

		process.exit(failed);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
