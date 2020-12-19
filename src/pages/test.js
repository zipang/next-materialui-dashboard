import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Wizard from "@components/Wizard";

const IndexPage = () => {
	const steps = [1, 2, 3, 4, 5];

	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Wizard steps={steps} />
		</CenteredPaperSheet>
	);
};

export default IndexPage;
