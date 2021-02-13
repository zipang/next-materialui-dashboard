/**
 * Parse Objects as provided by the SDK don't allow direct access
 * to the object fields.
 * We must use getters and setters instead
 * But now... we have Proxy to resolve that !
 * @param {ParseObject} parseObject
 */
const ParseProxy = (parseObject) =>
	new Proxy(parseObject, {
		get: (obj, propName) => {
			return obj[propName] === undefined
				? parseObject.get(obj, propName)
				: obj[propName];
		},
		set: (obj, propName, value) => obj.set(propName, value)
	});

export default ParseProxy;
