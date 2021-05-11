import { useEffect, useState } from "react";
import { withAuthentication } from "@components/AuthenticationProvider.js";
import Dashboard from "@components/Dashboard.js";
import { useRouter } from "next/router";
import MemberAdhesionsDataTable from "@components/tables/MemberAdhesionsDataTable.js";
import UsersApiClient from "@lib/client/UsersApiClient.js";
import { withEventBus } from "@components/EventBusProvider.js";

const MemberPage = ({ user }) => {
	const router = useRouter();
	const [adhesions, setAdhesions] = useState();
	const [error, setError] = useState(false);

	useEffect(async () => {
		try {
			if (!adhesions) {
				const { rows } = await UsersApiClient.getAdhesions(user);
				if (rows.length === 0) {
					// Nothing yet : open the registration form
					router.push("/member/registration");
				} else if (
					rows[0].statut === "a_renouveler" ||
					rows[0].statut === "closed"
				) {
					// The latest adhesion is not valid anymore
					router.push(`/member/${rows[0].siret}/re-adhesion`);
				} else {
					console.log(
						`Loaded ${rows.length} adhesions for user ${user.username}`
					);
					setAdhesions(rows);
				}
			}
		} catch (err) {
			setError(err.message);
		}
	}, [false]);

	return adhesions ? (
		<Dashboard title="ESPACE MEMBRE INVIE" user={user}>
			<MemberAdhesionsDataTable user={user} adhesions={adhesions} />
		</Dashboard>
	) : error ? (
		<div className="error">{error}</div>
	) : null;
};

export default withEventBus(
	withAuthentication(MemberPage, {
		profiles: ["member"],
		loginPage: "/login",
		redirectTo: "/member"
	})
);
