import { toRenew } from "@models/Adhesion";

/**
 *
 */
const updateAdhesionsStatus = async (req, resp) => {
	try {
		const report = await toRenew();
		return resp.status(200).json(report);
	} catch (err) {
		const message = `updateAdhesionsStatus CRON Job failed. (${err.message})`;
		console.error(message, err);
		resp.status(err.code || 500).json({
			success: false,
			error: message
		});
	}
};

export default updateAdhesionsStatus;
