import Step from "./Step";

/**
 * @typedef StateMachineDef
 * @property {String} id a unique name for this state machine
 * @property {Object} [initialState={}] the initial state
 * @property {Object} actions an objects where keys are action names
 *                 and values are functions that return a new state
 * @property {Array} [middlewares=[]] an optional array of function to be runned each times just before the state changes
 */

/**
 * Find the current index of a step
 * @param {Array<Step>} steps
 * @param {String} stepId id of the step to find
 * @return {Number} step index or -1 if not found
 */
const findIndex = (steps = [], stepId) => {
	if (stepId in steps) return steps[stepId];
	let i = 0;
	while (i < steps.length) {
		if (steps[i].id === stepId) {
			return i;
		}
		i++;
	}
	return -1;
};

/**
 * Go to the specified index or id
 * NOTE : Accepts the special word `next` to find the next step
 * @param {Object} state
 * @param {(String|Number)} where (id or index)
 * @return {Object} Updated state if the next step was found
 */
const transitionTo = (state, where) => {
	const { id, steps = [] } = state;
	let currentIndex = -1;

	if (typeof where === "number") {
		currentIndex = where;
	} else if (where === "next") {
		currentIndex = state.currentIndex + 1;
	} else if (where === "previous") {
		currentIndex = state.currentIndex - 1;
	} else if (typeof where === "string") {
		currentIndex = findIndex(steps, where);
	}

	console.log(`transitionTo('${where}') => steps[${currentIndex}]`);

	const currentStep = steps[currentIndex];

	if (currentStep) {
		return { ...state, currentStep, currentIndex };
	} else {
		console.warn(
			`Wizard ${id} : Step '${where}' doesn't exist. (Current step : ${currentStep.id})`
		);
		return state;
	}
};

/**
 * Go back to previous step in the state's history
 **/
const back = (state) => {
	const { steps, history } = state;
	if (history.length) {
		const currentStep = history.pop();
		return {
			...state,
			history,
			currentStep,
			currentIndex: findIndex(steps, currentStep.id)
		};
	} else {
		return state; // unchanged
	}
};

/**
 * A dedicated state machine to move the wizard from steps to steps
 *
 * @param {String} id
 * @param {Array<Step>} [steps=[]]
 * @param {Object} [data={}]
 * @param {Number} [initialStep=0]
 * @return {StateMachineDef}
 */
const WizardStateMachine = ({ id, steps = [], data = {}, initialStep = 0 }) => {
	if (typeof initialStep === "string") {
		console.log(`Look for initial step ${initialStep}`);
		initialStep = findIndex(steps, initialStep);
		if (initialStep === -1) initialStep = 0;
	}
	return {
		id,

		initialState: {
			data,
			steps,
			history: [],
			currentIndex: initialStep,
			currentStep: steps[initialStep]
		},

		actions: {
			/**
			 * Transition to the next step in the wizard
			 * @param {Object} state
			 */
			next: async (state) => {
				const { history, currentStep } = state;
				const stepActions = currentStep.actions || [];

				// The transition will give us a new state instance unless it is impossible to find the next step
				let updatedState;
				if (typeof stepActions.next === "function") {
					// Let's apply the step's redefined next action
					updatedState = await stepActions.next(state);
				} else {
					updatedState = transitionTo(state, "next");
				}

				if (updatedState !== state) {
					history.push(currentStep);
				}

				return updatedState;
			},
			/**
			 * Transition to the previous step in the wizard
			 * @param {Object} state
			 */
			previous: async (state) => {
				console.log(`previous()`, state);
				const { history, currentStep } = state;

				// The transition will give us a new state instance unless it is impossible to find the previous step
				if (history.length === 0) {
					return transitionTo(state, "previous");
				} else {
					// Let's depile the history
					return back(state);
				}
			},
			back,
			goto: transitionTo
		}
	};
};

export default WizardStateMachine;
