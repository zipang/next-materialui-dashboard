import { forwardRef, useEffect, memo } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

import SvgIcon from "@components/SvgIcon";
import { withStateMachine } from "@components/StateMachine";
import EventBusProvider, {
	useEventBus,
	withEventBus
} from "@components/EventBusProvider";

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
const DisplayStep = memo(
	forwardRef(({ step, data, onSubmit }, ref) => (
		<Box width="100%" height="100%" ref={ref}>
			<h2>{step.title}</h2>
			{step.displayForm(data, onSubmit)}
		</Box>
	))
);

const WizardControls = ({ children }) => (
	<Box display="flex" flexDirection="row" justifyContent="flex-end" padding="1rem">
		{children}
	</Box>
);

/**
 * Define the actions that are available on our Wizard
 * Finite State Machine associates a given state
 * and a defined set of actions to transition from one state to another
 * @param {Object} state Initial state available to any actions
 * @param {Function} setState Apply the new state and re-render the component
 */

const transition = (state, to) => {
	const [slideDirectionIn, slideDirectionOut] =
		state.currentSlide < to ? ["right", "left"] : ["left", "right"];
	return {
		...state,
		currentSlide: to,
		slideDirectionIn,
		slideDirectionOut
	};
};
const next = (state) => {
	return transition(state, state.currentSlide + 1);
};
const previous = (state) => {
	return transition(state, state.currentSlide - 1);
};

/**
 * Receives the steps and the state machine altogether
 */
const InitWizard = ({ steps = [], state, actions }) => {
	const eb = useEventBus();

	// flatten the state
	const { data, currentSlide, slideDirectionIn, slideDirectionOut } = state;

	// Define a validate combo action that merge step data and transition to next step
	const validateStep = (payload) => {
		console.dir(`Validate step payload :`, payload);
		console.trace();
		actions.merge(state, { data: payload });
		actions.next();
	};

	/**
	 * This event may trigger the onSubmit or onError
	 */
	const triggerValidate = () => {
		eb.send(`${steps[currentSlide].id}:validate`);
	};

	useEffect(() => {
		console.log(`Re-rendering Wizard`);
	});

	return (
		<WizardContainer>
			<WizardViewport>
				{steps.map((step, i) => (
					<Slide
						key={`slide-${i}`}
						in={i === currentSlide}
						direction={
							i === currentSlide ? slideDirectionOut : slideDirectionIn
						}
						mountOnEnter
						unmountOnExit
					>
						<DisplayStep step={step} data={data} onSubmit={validateStep} />
					</Slide>
				))}
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
					ml="1rem"
					disabled={currentSlide >= steps.length - 1}
					onClick={actions.next}
				>
					Etape suivante
				</Button>
				<Button
					variant="contained"
					color="secondary"
					ml="1rem"
					startIcon={<SvgIcon name="Save" />}
					onClick={triggerValidate}
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
		currentSlide: 0,
		slideDirectionIn: "right",
		slideDirectionOut: "left"
	},
	actions: {
		transition,
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
			{ steps }
		)
	)();

export default Wizard;
