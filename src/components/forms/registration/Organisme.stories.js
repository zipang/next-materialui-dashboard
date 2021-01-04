// Organisme.stories.js
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import { OrganismeForm } from "./Organisme";

// This default export determines where your story goes in the story list
export default {
	title: "Saisie Organisme"
};

const data = {
	siret: "789898876567898"
};

/**
 * form
 */
export const EmptyOrganismeForm = () => (
	<CenteredPaperSheet fullHeight={true}>
		<OrganismeForm data={data} onSubmit={(data) => alert(JSON.stringify(data))} />
	</CenteredPaperSheet>
);
