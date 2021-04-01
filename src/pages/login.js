import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import Login from "@components/Login.js";

const LoginPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Login useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default LoginPage;
