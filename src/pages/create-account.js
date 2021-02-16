import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Register from "@components/Register";

const CreateAccountPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Register useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default CreateAccountPage;
