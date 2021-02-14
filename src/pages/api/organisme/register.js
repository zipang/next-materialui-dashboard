import { getParseInstance } from "@models/ParseSDK";

/**
 *
 */
export default async (req, resp) => {
	try {
		const data = req.body;
		const Parse = getParseInstance();
		const organisme = await Parse.Organisme.register(data);
		resp.json({
			success: true,
			organisme
		});
	} catch (err) {
		resp.status(err.code).json({
			success: false,
			error: err.message
		});
	}
};
