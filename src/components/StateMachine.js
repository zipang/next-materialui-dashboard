import { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@lib/utils/deepMerge";

const StateMachinesContext = createContext();

/**
 * @typedef StateMachineDef
 * @field {String} id a unique name for this state machine
 * @field {Object} [state={}] the initial state
 * @field {Object} actions an objects where keys are action names
 *                 and values are functions that return a new state
 * @field {Array} [midlewares=[]] an optional array of function to be runned each times the state change
 */
/**
 * @param {StateMachineDef} machineDef
 */
const createMachine = ({ id, state = {}, actions = {} }) => {
	// Transform the actions so that they really change the state
	Object.keys(actions).forEach((actionName) => {
		action = (payload) => () => {};
	});
};

const useMachine = () => {};
/**
 *
 * @param {JSX.Element} Component
 * @param {StateMachineDef} stateMachineDef
 */
const withStateMachine = (Component, stateMachineDef) => ({ ...props }) => {
	const [stateMachine, setStateMachine] = useState();

	setStateMachine(createMachine(machineDef, setStateMachine));

	return (
		<StateMachinesContext.Provider value={stateMachine}>
			<Component {...props} />
		</StateMachinesContext.Provider>
	);
};
