import CenteredPaperSheet from "@components/CenteredPaperSheet";
import SwipeableViews from "react-swipeable-views";
import EventBusProvider from "@components/EventBusProvider";
import Register from "@components/Register";
import Login from "@components/Login";
import ForgotPassword from "@components/ForgotPassword";
import { useState } from "react";

const FORGOT_PASSWORD_VIEW = 0;
const LOGIN_VIEW = 1;
const REGISTER_VIEW = 2;

const SwipeViews = () => {
	const [currentView, setCurrentView] = useState(LOGIN_VIEW);
	const eventListeners = {
		forgotPassword: () => setCurrentView(FORGOT_PASSWORD_VIEW),
		login: () => setCurrentView(LOGIN_VIEW),
		register: () => setCurrentView(REGISTER_VIEW)
	};

	return (
		<EventBusProvider listeners={eventListeners}>
			<SwipeableViews index={currentView}>
				<ForgotPassword />
				<Login />
				<Register />
			</SwipeableViews>
		</EventBusProvider>
	);
};

const IndexPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<SwipeViews />
		</CenteredPaperSheet>
	);
};

export default IndexPage;
