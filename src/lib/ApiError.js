/**
 * Extends the default Error object to embed a status code
 * (for use as an API response HTTP status in case of an error)
 */
export default class ApiError extends Error {
	constructor(statusCode, message) {
		super(message);
		this.code = statusCode;
	}
}
