import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import { UserDashboard } from "../index.js";
import { formSteps } from "@forms/registration/RegistrationSteps.js";
import { useEventBus, withEventBus } from "@components/EventBusProvider.js";
import ReadOnlyForm from "@components/forms/ReadOnlyForm.js";
import {
	useAuthentication,
	withAuthentication
} from "@components/AuthenticationProvider.js";

const emptyCertification = (stepId) => (field) => {
	if (
		stepId === "step-certifications" &&
		field.type === "group" &&
		field.fields[0].value === "N"
	) {
		// Does this group have a NO
		return false;
	}
	return true; // ok
};

const tabsDef = formSteps
	.filter((step) => Array.isArray(step.fields))
	.map(({ id, title, fields }) => ({
		id,
		title,
		fields: fields
			.map(({ name, label, type = "text", options, size = 1, fields }) => ({
				name,
				label,
				type,
				options,
				size: type === "group" ? 1 : size,
				fields
			}))
			.filter((field) => field.type != "radio")
			.filter(emptyCertification(id))
	}));

const defineTabs = (eb, setCurrentTab) =>
	tabsDef.map((t) => ({
		value: t.id,
		label: t.title,
		action: () => {
			eb.emit("tab:change", t.id);
			setCurrentTab(t.id);
		}
	}));

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

const TabbedView = ({ adherent, error }) => {
	if (error) return <Box>{error}</Box>;
	if (adherent) return <ReadOnlyForm tabs={tabsDef} data={adherent} />;
	return null;
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
			const { adherent } = await AdherentsApiClient.retrieveBySiret(siret);
			setAdherent(adherent);
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	return (
		<UserDashboard
			user={loggedUser}
			title={adherent && adherent.nom}
			tabs={defineTabs(eb, setCurrentTab)}
			currentTab={currentTab}
		>
			<TabbedView adherent={adherent} error={error} />
		</UserDashboard>
	);
};

export default withAuthentication(withEventBus(PageDetailAdherent), {
	profiles: ["member"],
	loginPage: "/login",
	redirectTo: "/member"
});
