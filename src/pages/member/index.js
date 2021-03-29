import { useEffect, useState } from "react";
import { withAuthentication } from "@components/AuthenticationProvider";
import Dashboard from "@components/Dashboard";
import { useRouter } from "next/router";
import MemberAdhesionsDataTable from "@components/tables/MemberAdhesionsDataTable";
import UsersApiClient from "@lib/client/UsersApiClient";
import { withEventBus } from "@components/EventBusProvider";

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
