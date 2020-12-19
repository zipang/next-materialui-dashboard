// Wizard.stories.js
import Wizard from "./Wizard";
// import { Box } from "@material-ui/core";

// Create some dummy steps to display
const steps = [1, 2, 3, 4, 5];

// This default export determines where your story goes in the story list
export default {
	title: "Wizard"
};

/**
 * Show all the available icons
 */
export const FiveDummySteps = () => <Wizard steps={steps} currentSlide={0} />;
