import { withAuthentication } from "@components/AuthenticationProvider";
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import RegistrationWizard from "@components/forms/registration/RegistrationWizard";

const RegistrationPage = ({ user }) => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<RegistrationWizard user={user} />
		</CenteredPaperSheet>
	);
};

export default withAuthentication(RegistrationPage, {
	profiles: ["member"],
	loginPage: "/login",
	redirectTo: "/member"
});
