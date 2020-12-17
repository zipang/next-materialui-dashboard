/**
 * Parse Objects as provided by the SDK don't allow direct access
 * to the oebjct fields.
 * We must use getters and setters instead
 * But now... we have Proxy to resolve that !
 * @param {import { ParseObject } from "parse/node.js"} parseObject
 */
const ParseObjectProxy = (parseObject) =>
	new Proxy(parseObject, {
		get: (obj, propName) => parseObject.get(obj, propName),
		set: (obj, propName, value) => obj.set(propName, value)
	});

export default ParseObjectProxy;
