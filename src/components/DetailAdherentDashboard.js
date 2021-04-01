import { useEffect, useState } from "react";
import { useEventBus } from "@components/EventBusProvider.js";
import ActionButton from "@components/forms/ActionButton.js";
import TabbedView, { buildTabHeaders } from "@components/forms/tabs/TabbedView.js";
import AdherentsApiClient from "@lib/client/AdherentsApiClient.js";
import { formSteps } from "@forms/registration/RegistrationSteps.js";
import Dashboard from "@components/Dashboard.js";
import { useAuthentication } from "./AuthenticationProvider.js";

// Some steps may not contain fields
const steps = formSteps.filter((step) => Array.isArray(step.fields));

/**
 * Display the detail of an adherent using multiple tabs
 * to organize the data
 */
export const DetailAdherentDashboard = ({ siret }) => {
	const eb = useEventBus();
	const { loggedUser } = useAuthentication();
	const [currentTab, setCurrentTab] = useState(formSteps[0].id);
	const [editMode, setEditMode] = useState(false);
	const [adherent, setAdherent] = useState();
	const [error, setError] = useState(false);

	const updateAdherent = async (data) => {
		setAdherent(await AdherentsApiClient.update(loggedUser, data));
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
	}, [siret, currentTab]);

	return (
		<Dashboard
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
		</Dashboard>
	);
};

export default DetailAdherentDashboard;
