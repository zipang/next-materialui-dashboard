// SiretSearch.stories.js
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import { SiretSearchForm } from "./SiretSearch";

// This default export determines where your story goes in the story list
export default {
	title: "Siret Search"
};

/**
 * Simple search form that call the Sirene API
 */
export const SimpleSiretSearch = () => (
	<CenteredPaperSheet fullHeight={true}>
		<SiretSearchForm onSuccess={console.dir} />
	</CenteredPaperSheet>
);
