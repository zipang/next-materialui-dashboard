import { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@lib/utils/deepMerge";

const StateMachinesContext = createContext();

/**
 * Utility action on which more complex actions can rely
 */
const _DEFAULT_ACTIONS = {
	merge: (state, payload) => deepMerge(state, payload)
};

const _MIDDLEWARES = {
	log: (id, actionName, oldState, newState) => {
		console.dir(
			`State machine ${id} transition ${actionName} : `,
			oldState,
			` => `,
			newState
		);
	},
	localStorage: (id, actionName, oldState, newState) => {
		if (window && window.localStorage) {
			window.localStorage.setItem(id, newState);
		}
	}
};

/**
 * @typedef StateMachineDef
 * @field {String} id a unique name for this state machine
 * @field {Object} [initialState={}] the initial state
 * @field {Object} actions an objects where keys are action names
 *                 and values are functions that return a new state
 * @field {Array} [middlewares=[]] an optional array of function to be runned each times just before the state changes
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
 * HOC to inject {state, actions} and a State Machine Provider around the original Component
 * @param {JSX.Element} Component
 * @param {StateMachineDef} [overrideMachineDef] Can override all or nothing of the Component.StateMachine
 * @param {Object} [props] Optional initial props to pass down to the wrapped component
 */
export const withStateMachine = (
	Component,
	overrideMachineDef = {},
	initialProps = {}
) => ({ ...props }) => {
	// we can override the initial state and middlewares this way
	const mergedDefinitions = deepMerge({}, Component.StateMachine, overrideMachineDef);
	const {
		id,
		actions = {},
		middlewares = [],
		useLocalStorage = false
	} = mergedDefinitions;
	let initialState = mergedDefinitions.initialState || {};

	if (useLocalStorage && window && window.localStorage) {
		middlewares.push(_MIDDLEWARES.localStorage);
		const savedState = window.localStorage.getItem(id);
		if (savedState && typeof savedState === "object") {
			console.log(
				`Restoring saved state : ${JSON.stringify(savedState, null, "\t")}`
			);
			initialState = savedState;
		}
	}

	const [state, setState] = useState(initialState);

	if (process.env.NODE_ENV !== "production") {
		middlewares.push(_MIDDLEWARES.log);
	}

	/**
	 * Wrap the actions, apply the middlewares and the final setState() to automatically transition
	 **/
	const enhancedActions = Object.keys(actions).reduce((wrapped, name) => {
		wrapped[name] = (...args) => {
			try {
				let newState = actions[name](state, ...args);

				if (newState !== undefined && newState !== state) {
					// Apply the middlewares
					middlewares.forEach((midw) => {
						const updated = midw(id, name, state, newState);
						if (typeof updated === "object") {
							newState = updated;
						}
					});
					setState(newState);
				} else {
					console.log(`Action ${name} didn't change ${id} machine state`);
				}
			} catch (err) {
				console.error(
					`Action ${name}(${JSON.stringify(
						state,
						null,
						"\t"
					)}) failed on ${id} machine`
				);
			}
		};
		return wrapped;
	}, _DEFAULT_ACTIONS);

	console.log(`State Machine actions : ${Object.keys(enhancedActions)}`);

	return (
		<StateMachinesContext.Provider value={{ state, actions: enhancedActions }}>
			<Component
				state={state}
				actions={enhancedActions}
				{...initialProps}
				{...props}
			/>
		</StateMachinesContext.Provider>
	);
};
