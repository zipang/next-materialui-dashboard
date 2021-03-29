import { withEventBus } from "@components/EventBusProvider";
import { withAuthentication } from "@components/AuthenticationProvider";
import DetailAdherentDashboard from "@components/DetailAdherentDashboard";

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
		profiles: ["admin"],
		loginPage: "/admin/login",
		redirectTo: "/admin/adherents" // There is a quirck here to retrieve the [siret] param
	})
);
