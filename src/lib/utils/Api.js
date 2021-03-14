/**
 * Extract the search params from and incoming HTTP GET request
 * @param {IncomingMessage} req
 * @return {URLSearchParams}
 */
 export const getSearchParams = (req) =>
 new URL(req.url, `http://${req.headers.host}`).searchParams;
