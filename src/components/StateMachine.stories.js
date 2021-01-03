// StateMachine.stories.js
import { useEffect } from "react";
import { FormControlLabel, Box, Checkbox, Button } from "@material-ui/core";
import { withStateMachine, useStateMachine } from "./StateMachine";

export default {
	title: "State Machine"
};

const Interrupteur = ({ state, actions }) => {
	// const { state, actions } = useStateMachine();
	useEffect(() => {
		console.log("Re-rendering Interrupteur");
	});
	return (
		<Box>
			<FormControlLabel
				control={<Checkbox checked={state.checked} />}
				label={state.label}
			/>
			<Button onClick={actions.on} variant="contained" color="secondary">
				ON
			</Button>
			<Button onClick={actions.off} variant="contained" color="default">
				OFF
			</Button>
			<Button onClick={actions.toggle} variant="contained" color="primary">
				TOGGLE
			</Button>
		</Box>
	);
};

Interrupteur.STATES = {
	ON: { checked: true, label: "ON" },
	OFF: { checked: false, label: "OFF" }
};

const OnOffStateMachine = {
	id: "interrupteur",
	initialState: Interrupteur.STATES.OFF,
	actions: {
		off: () => Interrupteur.STATES.OFF,
		on: () => Interrupteur.STATES.ON,
		toggle: (state) =>
			state.checked ? Interrupteur.STATES.OFF : Interrupteur.STATES.ON
	}
};

/**
 * A super simple state machine (ON/OFF)
 */
export const InterrupteurStateMachine = withStateMachine(Interrupteur, OnOffStateMachine);
