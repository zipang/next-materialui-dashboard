// SvgIcon.stories.js
import SvgIcon, { names } from "./SvgIcon";

// This default export determines where your story goes in the story list
export default {
	title: "SvgIcon",
	component: SvgIcon,
	argTypes: {
		name: {
			control: {
				type: "select",
				options: names
			}
		}
	}
};

const Template = (args) => <SvgIcon {...args} />;

/**
 * Show all the available icons
 */
export const AvailableIcons = Template.bind({});
AvailableIcons.args = {
	/* the args you need here will depend on your component */
	name: "Save"
};
