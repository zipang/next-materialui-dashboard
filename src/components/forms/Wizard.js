import { useEffect, memo } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import SvgIcon from "@components/SvgIcon";
import { useStateMachine, withStateMachine } from "@components/StateMachine";
import { useEventBus, withEventBus } from "@components/EventBusProvider";
import Step from "@forms/Step";

/**
 * @typedef Step
 * @field {String} id
 * @field {String} title
 * @field {Function} displayForm
 */

/**
 * @typedef WizardProps
 * @field {String} id required a unique id for this wizard
 * @field {Step[]} steps the array of steps that will be executed in sequence
 * @field {Object} initialData the initial data to render
 * @field {Number} [currentSlide=0] the current slide to render
 */

const WizardContainer = ({ children }) => (
	<Box
		display="flex"
		flexDirection="column"
		alignItems="stretch"
		height="100%"
		width="100%"
	>
		{children}
	</Box>
);
const WizardViewport = ({ children }) => (
	<Box flexGrow={1} overflow="hidden" position="relative" height="100%">
		{children}
	</Box>
);
/**
 * Being used inside a Slide component, the Display Step must forward a ref
 * @see https://material-ui.com/guides/composition/#caveat-with-refs
 */
const DisplayStep = ({ step, data, onSubmit }) => (
	<Box width="100%" height="100%">
		<h2>{step.title}</h2>
		{step.displayForm(data, onSubmit)}
	</Box>
);
const WizardControls = memo(({ children }) => (
	<Box display="flex" flexDirection="row" justifyContent="flex-end" padding="1rem">
		{children}
	</Box>
));

/**
 * Define the actions that are available on our Wizard
 * Finite State Machine associates a given state
 * and a defined set of actions to transition from one state to another
 * @param {Object} state Initial state available to any actions
 */

const gotoSlide = (state, to) => {
	return {
		...state,
		currentSlide: to
	};
};
const next = (state) => {
	return gotoSlide(state, state.currentSlide + 1);
};
const previous = (state) => {
	return gotoSlide(state, state.currentSlide - 1);
};

/**
 * Receives the steps and the state machine altogether
 */
const InitWizard = ({ id, steps = [] }) => {
	const eb = useEventBus();
	const { state, actions } = useStateMachine();

	// flatten the state
	const { data, currentSlide } = state;

	// Define a validate combo action that merge current step data and transition to the next step
	const validateStep = (payload, errors) => {
		const newData = [{ data: payload }];

		if (Object.keys(errors).length === 0 && currentSlide < steps.length - 1) {
			// We can pass to next slide
			console.log("Goto to next step.");
			newData.push({ currentSlide: state.currentSlide + 1 });
		}

		const newState = actions.merge({}, { ...state }, ...newData); // << It's very important here to recreate a new state object
		actions.transition("Wizard", "validateStep", state, newState);
	};

	/**
	 * This event may trigger the onSubmit or onError
	 */
	const triggerValidate = () => {
		eb.send(`${steps[currentSlide].id}:validate`);
	};

	const sendData = () => {
		const lastStep = steps[steps.length - 1];
		console.log("Sending last step data", data);
		if (typeof lastStep.onSubmit === "function") {
			lastStep.onSubmit(data);
		}
	};

	useEffect(() => {
		console.log(
			`Rendering slide ${currentSlide} of wizard ${id} with ${JSON.stringify(
				data,
				null,
				"\t"
			)}`
		);
	}, [currentSlide]);

	return (
		<WizardContainer>
			<WizardViewport>
				<DisplayStep
					step={new Step(steps[currentSlide])}
					data={data}
					onSubmit={validateStep}
				/>
			</WizardViewport>
			<WizardControls>
				<Button
					variant="outlined"
					disabled={currentSlide === 0}
					onClick={actions.previous}
				>
					Etape précédente
				</Button>
				<Button
					variant="outlined"
					disabled={currentSlide >= steps.length - 1}
					onClick={triggerValidate}
				>
					Etape suivante
				</Button>
				<Button
					variant="contained"
					color="secondary"
					disabled={currentSlide < steps.length - 1}
					startIcon={<SvgIcon name="Save" />}
					onClick={sendData}
				>
					Enregistrer
				</Button>
			</WizardControls>
		</WizardContainer>
	);
};

InitWizard.StateMachine = {
	useLocalStorage: true,
	initialState: {
		data: {},
		currentSlide: 0
	},
	actions: {
		gotoSlide,
		next,
		previous
	}
};

/**
 * A Wizard is a component that displays steps to accomplish
 * a complex task, like a form registration with a lots of pages of inputs
 * @param {WizardProps} props
 */
const Wizard = ({ id, steps = [], data = {}, currentSlide = 0 }) =>
	withEventBus(
		withStateMachine(
			InitWizard,
			{ id, initialState: { data, currentSlide } },
			{ id, steps }
		)
	)();

export default Wizard;
