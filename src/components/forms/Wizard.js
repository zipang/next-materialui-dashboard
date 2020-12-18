import { useState, createContext } from "react";
import { Box, Button, Divider, Slide } from "@material-ui/core";
import Center from "@components/Center";
import { ArrowRight, Save } from "@material-ui/icons";

const WizardContext = createContext();

/**
 * @typedef WizardProps
 * @param {Step[]} steps the array of steps that will be executed in sequence
 * @param {Object} data the initial data to render
 * @param {Number} [currentSlide=0] the current slide to render
 */

const useStyles = makeStyles((theme) => ({
	wizard: {
		display: theme.spacing(2),
		width: theme.spacing(8),
		height: theme.spacing(8),
		backgroundColor: theme.palette.secondary.main
	}
}));

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
		setState({
			currentSlide: to,
			slideDirectionIn,
			slideDirectionOut
		});
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
const Wizard = ({ steps = [], data = {}, currentSlide = 0 }) => {
	const styles = useStyles();
	// This is the state of the current displayed slide with its in and out animation
	const [state, setState] = useState({
		currentSlide,
		slideDirectionIn: "right",
		slideDirectionOut: "right"
	});
	const [data, setData] = useState(data);
	const actions = createActions(state, setState);

	return (
		<WizardContext.Provider value={{ state, data, actions }}>
			<Box
				className="wizard"
				display="flex"
				alignItems="stretch"
				minWidth="80%"
				minHeight="80%"
			>
				<Box
					flexGrow={1}
					className="viewport"
					overflow="hidden"
					position="relative"
				>
					{steps.map((step, i) => (
						<Slide
							key={`slide-${i}`}
							in={i === currentSlide}
							direction={
								i === currentSlide ? slideDirectionIn : slideDirectionOut
							}
							mountOnEnter
							unmountOnExit
						>
							<Center>
								<h1>Slide #{i}</h1>
							</Center>
						</Slide>
					))}
				</Box>
				<Divider />
				<Box className="wizard-controls" display="flex">
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
						onClick={actions.next}
					>
						Etape suivante
					</Button>
					<Button startIcon={<SaveIcon />}>Enregistrer</Button>
				</Box>
			</Box>
		</WizardContext.Provider>
	);
};

export default Wizard;
