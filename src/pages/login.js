import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Login from "@components/Login";

const LoginPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Login useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default LoginPage;
