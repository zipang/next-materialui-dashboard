import { memo } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import SvgIcon from "@components/SvgIcon";
import { useEventBus, withEventBus } from "@components/EventBusProvider";
import Step from "@components/forms/wizard/Step";
import { useAuthentication } from "@components/AuthenticationProvider";
import { isEmpty } from "@lib/utils/NestedObjects";
import { useStateMachine, withStateMachine } from "@components/StateMachine";
import WizardStateMachine from "./WizardStateMachine";
import { useRouter } from "next/router";

const useWizardStyles = (customStyles = {}) =>
	makeStyles((theme) => ({
		viewport: {
			overflow: "hidden",
			width: "100%",
			display: "flex",
			flexGrow: "1",
			borderBottom: "1px solid #aaa",
			minWidth: "66vw",
			minHeight: "66vh"
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
			display: "flex",
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
 * @property {String} id! required a unique id to identify this wizard (and allow sending messages)
 * @property {Step[]} steps the array of steps that will be executed in sequence
 * @property {Object} data the initial data to render
 * @property {Number} [initialSteps=0] the current slide to render
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
 * Receives the steps and the state machine altogether
 * Props passed to the Wizard can override the initial state
 */
const _Wizard = (override) => {
	const classes = useWizardStyles();
	const eb = useEventBus();
	const router = useRouter();
	const { id, state: initialState, actions } = useStateMachine();
	const { loggedUser } = useAuthentication();

	// Merge the initial state and the props to get the final result
	if (override) {
		console.log(`Overriding Wizard stae with `, override);
	}
	let state = actions.merge(initialState, override);

	if (state.steps[state.data.statut]) {
		state = actions.goto(state, state.data.statut);
	}

	// Now we have a merged state
	const { data, steps, currentStep, currentIndex } = state;

	console.log(
		`Loaded wizard ${id} with ${steps.length} steps. Current step : ${currentIndex}`,
		state
	);

	// Validate the next step : merge new step data and transition to the next step
	// if there is no validation error
	const validateNextStep = async (payload, errors = {}) => {
		if (isEmpty(errors)) {
			// The data validation is ok : We can merge the data and pass to the next slide
			actions.merge(state, { data: payload });
			await actions.next(state);
		}
	};

	/**
	 * This event may trigger the onSubmit or onError inside the StepForm
	 */
	const triggerValidate = () => {
		eb.send(`${currentStep.id}:validate`);
	};

	return (
		<WizardContainer>
			<WizardViewport
				classes={classes}
				step={new Step(currentStep, `${currentIndex + 1}/${steps.length}`)}
				data={data}
				onSubmit={validateNextStep}
			/>
			<WizardControls>
				<Button
					key="btn-previous"
					variant="outlined"
					disabled={currentIndex === 0}
					onClick={actions.previous}
				>
					Etape précédente
				</Button>
				<Button
					key="btn-next"
					variant="outlined"
					disabled={currentIndex >= steps.length - 1}
					onClick={triggerValidate}
				>
					Etape suivante
				</Button>
				{Array.isArray(currentStep.actions) &&
					currentStep.actions.map(({ label, action, icon }) => (
						<Button
							key={`btn-${label}`}
							variant="contained"
							color="secondary"
							startIcon={icon && <SvgIcon name={icon} />}
							onClick={() => action(state, loggedUser, router)}
						>
							{label}
						</Button>
					))}
			</WizardControls>
		</WizardContainer>
	);
};

/**
 * A Wizard is a component that displays steps to accomplish
 * a complex task, like a form registration with a lots of pages of inputs
 * @param {WizardProps} props
 */
const Wizard = (props) =>
	withEventBus(withStateMachine(_Wizard, WizardStateMachine({ ...props })))();

export default Wizard;
