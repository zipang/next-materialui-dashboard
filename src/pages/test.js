import CenteredPaperSheet from "@components/CenteredPaperSheet";
import { SiretForm } from "@components/forms/registration/SiretSearch";
import Wizard from "@components/Wizard";

const IndexPage = () => {
	const steps = [1, 2, 3, 4, 5];

	return (
		<CenteredPaperSheet xs={10} md={8}>
			<SiretForm onSuccess={(resp) => alert(JSON.stringify(resp))} />
		</CenteredPaperSheet>
	);
};

export default IndexPage;
