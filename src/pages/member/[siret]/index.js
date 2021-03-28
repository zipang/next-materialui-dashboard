import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { useEffect, useState } from "react";
import { UserDashboard } from "../index.js";
import { formSteps } from "@forms/registration/RegistrationSteps.js";
import { useEventBus, withEventBus } from "@components/EventBusProvider.js";
import TabbedView, { buildTabHeaders } from "@components/forms/tabs/TabbedView.js";
import {
	useAuthentication,
	withAuthentication
} from "@components/AuthenticationProvider.js";

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

/**
 * Display the detail of an adherent using multiple tabs
 * to organize the data
 */
const PageDetailAdherent = ({ siret }) => {
	const eb = useEventBus();
	const { loggedUser } = useAuthentication();
	const [currentTab, setCurrentTab] = useState(formSteps[0].id);
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
		<UserDashboard
			user={loggedUser}
			title={adherent && adherent.nom}
			tabsDefs={buildTabHeaders(formSteps, eb, setCurrentTab)}
			currentTab={currentTab}
		>
			<TabbedView steps={formSteps} data={adherent} error={error} />
		</UserDashboard>
	);
};

export default withAuthentication(withEventBus(PageDetailAdherent), {
	profiles: ["member"],
	loginPage: "/login",
	redirectTo: "/member"
});
