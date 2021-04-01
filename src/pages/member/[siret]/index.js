import { withEventBus } from "@components/EventBusProvider.js";
import { withAuthentication } from "@components/AuthenticationProvider.js";
import DetailAdherentDashboard from "@components/DetailAdherentDashboard.js";

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

export default withEventBus(
	withAuthentication(DetailAdherentDashboard, {
		profiles: ["member"],
		loginPage: "/login",
		redirectTo: "/member" // There is a quirk here to retrieve the [siret] parameters
	})
);
