import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import ForgotPassword from "@components/ForgotPassword.js";

const ForgotPasswordPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<ForgotPassword useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default ForgotPasswordPage;
