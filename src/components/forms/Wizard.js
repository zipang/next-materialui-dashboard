import { useEffect, memo } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import SvgIcon from "@components/SvgIcon";
import { useStateMachine, withStateMachine } from "@components/StateMachine";
import { useEventBus, withEventBus } from "@components/EventBusProvider";
import Step from "@forms/Step";
import { useAuthentication } from "@components/AuthenticationProvider";

const useWizardStyles = (customStyles = {}) =>
	makeStyles((theme) => ({
		viewport: {
			overflow: "hidden",
			width: "100%",
			display: "flex",
			flexGrow: "1",
			borderBottom: "1px solid #aaa"
		},
		formContainer: {
			display: "flex",
			width: "100%",
			height: "100%",
			justifyContent: "center",
			alignItems: "center",
			alignContent: "flex-start",
			flexWrap: "wrap",
			padding: "0 1rem",
			backgroundColor: theme.palette.background.light
		},
		formTitle: {
			alignSelf: "flex-start",
			flex: "1 1 100%"
		},
		form: {
			alignSelf: "center",
			flex: "0 1 auto"
		},
		helpContainer: {
			display: "flex",
			height: "100%",
			width: "100%",
			backgroundColor: "white",
			padding: "2rem"
		}
	}))();

/**
 * @typedef Step
 * @property {String} id
 * @property {String} title
 * @property {Function} displayForm
 */

/**
 * @typedef WizardProps
 * @property {String} id required a unique id for this wizard
 * @property {Step[]} steps the array of steps that will be executed in sequence
 * @property {Object} initialData the initial data to render
 * @property {Number} [currentSlide=0] the current slide to render
 * @property {Function} onComplete The function to call with the complete data payload (last step)
 */

const WizardContainer = ({ children }) => (
	<Box display="flex" flexDirection="column" alignItems="stretch">
		{children}
	</Box>
);

/**
 * @typedef WizardViewportProps
 * @param {Object} classes Styling for the viewport
 * @param {Step} step The current step to display
 * @param {Object} data The current data payload
 * @param {Object} errors Contains the key of the first input whose validation ruiles failed
 * @param {Function} onSubmit Callback to be called with the forma data when validation has passed
 */
/**
 * The wizard view port may contain one or two children :
 * - The Contextual help and description of the setp,
 * - The Form container inside which the form should be centered
 * @param {WizardViewportProps} props
 */
const WizardViewport = ({ classes, step, data, errors, onSubmit }) => (
	<Box key="wizard-viewport" className={classes.viewport}>
		{step.help && (
			<Box className={classes.helpContainer} style={step.getBackgroundImageStyle()}>
				{step.displayHelp(data, errors, onSubmit)}
			</Box>
		)}
		{step.displayForm && (
			<Box className={classes.formContainer}>
				{!step.help && (
					<Box className={classes.formTitle}>
						<h2>{step.title}</h2>
					</Box>
				)}
				<Box className={classes.form}>{step.displayForm(data, onSubmit)}</Box>
			</Box>
		)}
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
	const classes = useWizardStyles();
	const eb = useEventBus();
	const { state, actions } = useStateMachine();
	const { loggedUser } = useAuthentication();

	// flatten the state
	const { data, currentSlide } = state;

	// Define a validate combo action that merge current step data and transition to the next step
	const validateStep = (payload, errors = {}) => {
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
			<WizardViewport
				classes={classes}
				step={
					new Step(steps[currentSlide], `${currentSlide + 1}/${steps.length}`)
				}
				data={data}
				onSubmit={validateStep}
			/>
			<WizardControls>
				<Button
					key="btn-previous"
					variant="outlined"
					disabled={currentSlide === 0}
					onClick={actions.previous}
				>
					Etape précédente
				</Button>
				<Button
					key="btn-next"
					variant="outlined"
					disabled={currentSlide >= steps.length - 1}
					onClick={triggerValidate}
				>
					Etape suivante
				</Button>
				<Button
					key="btn-validate"
					variant="contained"
					color="secondary"
					disabled={steps[currentSlide].validate === undefined}
					startIcon={<SvgIcon name="Save" />}
					onClick={() => steps[currentSlide].validate(data, loggedUser)}
				>
					Valider
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
			{ id, initialState: { data, currentSlide, steps } },
			{ id, steps }
		)
	)();

export default Wizard;
