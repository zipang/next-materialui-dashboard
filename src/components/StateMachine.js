import { createContext, useContext, useState } from "react";
import { merge } from "@lib/utils/deepMerge";
import JSON from "@lib/utils/JSON";

const StateMachinesContext = createContext();

/**
 * Utility action on which more complex actions can rely
 */
const _DEFAULT_ACTIONS = {
	merge
};

const _MIDDLEWARES = {
	/**
	 * Save the new state inside the local storage
	 * @param {String} id
	 * @param {String} actionName
	 * @param {Object} oldState
	 * @param {Object} newState
	 */
	localStorage: (id, actionName, oldState, newState) => {
		if (window && window.localStorage) {
			window.localStorage.setItem(id, JSON.stringify(newState));
		}
	}
};

/**
 * @typedef StateMachineDef
 * @property {String} id a unique name for this state machine
 * @property {Object} [initialState={}] the initial state
 * @property {Object} actions an objects where keys are action names
 *                 and values are functions that return a new state
 * @property {Array} [middlewares=[]] an optional array of function to be runned each times just before the state changes
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

export const enhanceActions = (id, actions, state, setState, middlewares) => {
	if (actions._enhanced) {
		console.log(`Actions are already enhanced !`);
		return actions;
	}

	if (actions.transition || actions.merge) {
		throw new TypeError(
			"Warning : 'transition' and 'merge' are 2 predefined actions names that are reserved for the state machine."
		);
	}

	console.log(`Enhancing state machine actions : ${Object.keys(actions)}`);

	const transition = (...args) => {
		if (args.length !== 4) {
			throw new TypeError(
				"actions.transition() must receive 4 arguments : machineId, actionName, oldState and newState"
			);
		} else {
			const [id, actionName, oldState, newState] = args;
			console.dir(
				`State machine ${id} transition '${actionName}' : `,
				oldState,
				` => `,
				newState
			);

			setState(newState);
		}
	};

	const enhancedActions = Object.keys(actions).reduce(
		(wrapped, name) => {
			// Create an inactive version that just return the state
			wrapped[`get_${name}`] = (...args) => actions[name](state, ...args);

			// Create the active version that applies the state transition
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
						transition(id, name, state, newState);
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
		},
		{
			transition,
			..._DEFAULT_ACTIONS
		}
	);
	console.log(`State Machine actions : ${Object.keys(enhancedActions)}`);
	enhancedActions._enhanced = true; // don't do it multiple times
	return enhancedActions;
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
	const mergedDefinitions = { ...Component.StateMachine, ...overrideMachineDef };

	const {
		id,
		actions = {},
		middlewares = [],
		useLocalStorage = false
	} = mergedDefinitions;

	let initialState = mergedDefinitions.initialState || {};

	if (useLocalStorage && window && window.localStorage) {
		middlewares.push(_MIDDLEWARES.localStorage);
	}

	const [state, setState] = useState(initialState);

	/**
	 * Wrap the actions, apply the middlewares and the final setState() to automatically transition
	 **/
	const enhancedActions = enhanceActions(id, actions, state, setState, middlewares);

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
