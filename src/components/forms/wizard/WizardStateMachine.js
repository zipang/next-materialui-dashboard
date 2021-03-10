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
	} else if (typeof where === "string") {
		currentIndex = findIndex(steps, where);
	}

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
 * A dedicated state machine to move from wizard steps to wizard steps
 *
 * @param {String} id
 * @param {Array<Step>} [steps=[]]
 * @param {Object} [data={}]
 * @param {Number} [initialStep=0]
 * @return {StateMachineDef}
 */
const WizardStateMachine = (id, steps = [], data = {}, initialStep = 0) => ({
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
		 * Go back to previous step in history
		 **/
		previous: (state) => {
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
		},
		goto: transitionTo
	}
});

export default WizardStateMachine;
