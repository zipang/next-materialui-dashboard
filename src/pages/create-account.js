import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import Register from "@components/Register.js";

const CreateAccountPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Register useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default CreateAccountPage;
