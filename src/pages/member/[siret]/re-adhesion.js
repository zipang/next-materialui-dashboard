import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { withEventBus } from "@components/EventBusProvider.js";
import ReadhesionWizard from "@components/forms/registration/ReadhesionWizard.js";
import { withAuthentication } from "@components/AuthenticationProvider.js";
import CenteredPaperSheet from "@components/CenteredPaperSheet.js";

/**
 * @see https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 * @returns {Object} props passed to main
 */
export const getServerSideProps = async (context) => {
	const { siret } = context.params;
	return {
		props: { siret } // will be passed to the page component as props
	};
};

const LoadReAdhesion = ({ data, error }) => {
	if (error) return <Box>{error}</Box>;
	if (data) return <ReadhesionWizard data={data} />;
	return null;
};

/**
 * Display the detail of an adherent using multiple tabs
 * to organize the data
 */
const PageReAdhesion = ({ siret }) => {
	const [adherent, setAdherent] = useState();
	const [error, setError] = useState(false);

	useEffect(async () => {
		try {
			const adherent = await AdherentsApiClient.retrieveBySiret(siret);
			setAdherent(adherent);
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	return (
		<CenteredPaperSheet xs={10} md={8}>
			<LoadReAdhesion data={adherent} error={error} />
		</CenteredPaperSheet>
	);
};

export default withAuthentication(withEventBus(PageReAdhesion), {
	profiles: ["member"],
	loginPage: "/login",
	redirectTo: "/member"
});
