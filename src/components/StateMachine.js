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
export const withStateMachine = (
	Component,
	{ id = "state-machine", initialState = {}, actions = {}, middlewares = [] }
) => ({ ...props }) => {
	const [state, setState] = useState(initialState);

	// Wrap the actions with a setState and middleware chain
	const enhancedActions = Object.keys(actions).reduce((final, name) => {
		final[name] = (...args) => {
			console.log(
				`Call action '${name}' will current state : ${JSON.stringify(
					state,
					null,
					"\t"
				)}`
			);

			const newState = actions[name](state, ...args);
			if (newState !== undefined && newState !== state) {
				console.log(
					`Action '${name}' will transition ${id} state to ${JSON.stringify(
						newState,
						null,
						"\t"
					)}`
				);
				setState(newState);
			}
		};
		return final;
	}, _DEFAULT_ACTIONS);

	return (
		<StateMachinesContext.Provider value={{ state, actions: enhancedActions }}>
			<Component state={state} actions={enhancedActions} {...props} />
		</StateMachinesContext.Provider>
	);
};
