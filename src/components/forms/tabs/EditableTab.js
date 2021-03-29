import { Grid } from "@material-ui/core";
import Step from "../wizard/Step";
import StepForm from "../wizard/StepForm";

/**
 * Find a step by its index or id
 * @param {Array} steps
 * @param {Number|String} indexOrID
 * @return {Step}
 */
const getStep = (steps = [], indexOrID = 0) => {
	const tabDef =
		indexOrID in steps ? steps[indexOrID] : steps.find((t) => t.id === indexOrID);
	console.log(`getTab(${indexOrID}) => `, tabDef);
	return new Step(tabDef);
};

const EditableTab = ({ steps, data, currentTab }) => {
	const currentStep = getStep(steps, currentTab);
	const { validation, fields } = currentStep;

	return (
		<StepForm
			formId={`${currentStep.id}`}
			data={data}
			validateStep={validation}
			customStyles={{ minWidth: "40em" }}
		>
			<Grid container>{currentStep.displayFields(fields)}</Grid>
		</StepForm>
	);
};

export default EditableTab;
