import { useEffect, useState } from "react";
import { useEventBus, withEventBus } from "@components/EventBusProvider.js";
import AdminDashboard from "../index.js";
import ActionButton from "@components/forms/ActionButton.js";
import TabbedView, { buildTabHeaders } from "@components/forms/tabs/TabbedView.js";
import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { formSteps } from "@forms/registration/RegistrationSteps.js";
import { withAuthentication } from "@components/AuthenticationProvider.js";

// Some steps may not contain fields
const steps = formSteps.filter((step) => Array.isArray(step.fields));

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
const PageDetailAdherent = ({ user, siret }) => {
	const eb = useEventBus();
	const [currentTab, setCurrentTab] = useState(formSteps[0].id);
	const [editMode, setEditMode] = useState(false);
	const [adherent, setAdherent] = useState();
	const [error, setError] = useState(false);

	const updateAdherent = async (data) => {
		setAdherent(await AdherentsApiClient.update(user, data));
		setEditMode(false);
	};

	useEffect(async () => {
		try {
			const adherent = await AdherentsApiClient.retrieveBySiret(siret);
			setAdherent(adherent);
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	useEffect(() => {
		const tabSubmit = `${currentTab}:submit`;
		eb.on(tabSubmit, updateAdherent);
		return () => {
			eb.off(tabSubmit, updateAdherent);
		};
	}, [currentTab]);

	return (
		<AdminDashboard
			title={adherent && adherent.nom}
			tabsDefs={buildTabHeaders(steps, eb, setCurrentTab)}
			currentTab={currentTab}
		>
			<TabbedView steps={steps} data={adherent} error={error} editMode={editMode} />
			{editMode ? (
				<ActionButton
					label="Enregistrer"
					name="Save"
					onClick={() => eb.emit(`${currentTab}:validate`)}
				/>
			) : (
				<ActionButton
					label="Editer"
					name="Edit"
					onClick={() => setEditMode(true)}
				/>
			)}
		</AdminDashboard>
	);
};

export default withEventBus(withAuthentication(PageDetailAdherent));
