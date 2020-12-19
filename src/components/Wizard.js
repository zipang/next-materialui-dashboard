import { useState, createContext } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

import SvgIcon from "@components/SvgIcon";

const WizardContext = createContext();

/**
 * @typedef WizardProps
 * @param {Step[]} steps the array of steps that will be executed in sequence
 * @param {Object} data the initial data to render
 * @param {Number} [currentSlide=0] the current slide to render
 */

const useStyles = makeStyles((theme) => ({
	slide: {
		position: "relative",
		height: "100%",
		width: "100%"
	}
}));

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
const SlideContainer = ({ children }) => (
	<Box width="100%" height="100%">
		{children}
	</Box>
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
const createActions = (state, setState) => {
	/**
	 * Transition the wizard to a new slide
	 * @param {Number} to index of the page to transition to
	 */
	const transition = (to) => {
		const [slideDirectionIn, slideDirectionOut] =
			state.currentSlide < to ? ["right", "left"] : ["left", "right"];
		const newState = {
			...state,
			currentSlide: to,
			slideDirectionIn,
			slideDirectionOut
		};
		console.log(`Transitionning to`, JSON.stringify(newState, null, "\t"));
		setState(newState);
	};
	const next = () => transition(state.currentSlide + 1);
	const previous = () => transition(state.currentSlide - 1);

	return { transition, next, previous };
};

/**
 * A Wizard is a component that displays steps to accomplish
 * a complex task, like a form registration with a lots of pages of inputs
 * @param {WizardProps} props
 */
const Wizard = ({ steps = [], data = {}, current = 0 }) => {
	const styles = useStyles();
	// This is the state of the current displayed slide with its in and out animation
	const [state, setState] = useState({
		data,
		currentSlide: current,
		slideDirectionIn: "right",
		slideDirectionOut: "left"
	});

	// flatten the state
	const { currentSlide, slideDirectionIn, slideDirectionOut } = state;

	const actions = createActions(state, setState);
	console.dir(`Wizard received ${steps.length} steps and`, actions);

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
						<Box className={styles.slide}>
							<h1>Slide #{i}</h1>
						</Box>
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
				>
					Enregistrer
				</Button>
			</WizardControls>
		</WizardContainer>
	);
};

export default Wizard;
