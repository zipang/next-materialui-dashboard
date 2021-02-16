import CenteredPaperSheet from "@components/CenteredPaperSheet";
import ForgotPassword from "@components/ForgotPassword";

const ForgotPasswordPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<ForgotPassword useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default ForgotPasswordPage;
