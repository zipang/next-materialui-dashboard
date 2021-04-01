import { withAuthentication } from "@components/AuthenticationProvider.js";
import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import RegistrationWizard from "@components/forms/registration/RegistrationWizard.js";

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
