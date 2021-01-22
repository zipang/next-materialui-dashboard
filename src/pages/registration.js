import CenteredPaperSheet from "@components/CenteredPaperSheet";
import RegistrationWizard from "@components/forms/registration/RegistrationWizard";

const IndexPage = () => {
	const steps = [1, 2, 3, 4, 5];

	return (
		<CenteredPaperSheet xs={10} md={8}>
			<RegistrationWizard />
		</CenteredPaperSheet>
	);
};

export default IndexPage;
