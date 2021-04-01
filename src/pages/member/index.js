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
				if (rows.length) {
					console.log(
						`Loaded ${rows.length} adhesions for user ${user.username}`
					);
					setAdhesions(rows);
				} else {
					router.push("/member/registration");
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
