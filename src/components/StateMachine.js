import { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@lib/utils/deepMerge";

const StateMachinesContext = createContext();

/**
 * Utility on which more complex actions can rely
 */
const _DEFAULT_ACTIONS = {
	merge: (state, payload) => deepMerge({}, state, payload),
	overwrite: (state, payload) => ({ ...payload })
};

/**
 * @typedef StateMachineDef
 * @field {String} id a unique name for this state machine
 * @field {Object} [initialState={}] the initial state
 * @field {Object} actions an objects where keys are action names
 *                 and values are functions that return a new state
 * @field {Array} [midlewares=[]] an optional array of function to be runned each times the state change
 */

export const useStateMachine = () => {
	const sm = useContext(StateMachinesContext);
	if (!sm) {
		throw new Error(
			`useStateMachine() hook can only be used from inside a decorated withStateMachine() HOC`
		);
	}
	return sm;
};

/**
 *
 * @param {JSX.Element} Component
 * @param {StateMachineDef} stateMachineDef
 */
const withStateMachine = (
	Component,
	{ id = "state-machine", initialState = {}, actions = {}, middlewares = [] }
) => ({ ...props }) => {
	const [state, setState] = useState(initialState);

	if (!actions.__machineEnabled) {
		// Wrap the actions with a setState and middleware
		Object.keys(actions).forEach((name) => {
			const originalAction = actions[name];
			actions[name] = ([...args]) => {
				const newState = originalAction(state, ...args);
				if (newState !== undefined && newState !== state) {
					console.log(
						`Action ${name} will transition ${id} state to ${JSON.stringify(
							newState,
							null,
							"\t"
						)}`
					);
					setState(newState);
				}
			};
		});
		actions.__machineEnabled = true;
	}

	return (
		<StateMachinesContext.Provider value={{ state, actions }}>
			<Component {...props} />
		</StateMachinesContext.Provider>
	);
};
