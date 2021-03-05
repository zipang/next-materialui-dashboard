import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Login from "@components/Login";

const LoginPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<Login admin={true} useEvents={false} />
		</CenteredPaperSheet>
	);
};

export default LoginPage;
