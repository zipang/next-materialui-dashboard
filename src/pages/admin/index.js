import CenteredPaperSheet from "@components/CenteredPaperSheet";
import SwipeableViews from "react-swipeable-views";
import EventBusProvider from "@components/EventBusProvider";
import SimpleLogin from "@components/SimpleLogin";
import ForgotPassword from "@components/ForgotPassword";
import { useState } from "react";

const FORGOT_PASSWORD_VIEW = 0;
const LOGIN_VIEW = 1;

const SwipeViews = () => {
	const [currentView, setCurrentView] = useState(LOGIN_VIEW);
	const eventListeners = {
		forgotPassword: () => setCurrentView(FORGOT_PASSWORD_VIEW),
		login: () => setCurrentView(LOGIN_VIEW)
	};

	return (
		<EventBusProvider listeners={eventListeners}>
			<SwipeableViews index={currentView}>
				<ForgotPassword />
				<SimpleLogin />
			</SwipeableViews>
		</EventBusProvider>
	);
};

/**
 * Page de login des administrateurs Invie
 */
const IndexPage = () => {
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<SwipeViews />
		</CenteredPaperSheet>
	);
};

export default IndexPage;
