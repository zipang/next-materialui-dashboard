// StepForm.stories.js
import StepForm from "./StepForm";
import JSON from "@lib/utils/JSON";
import { Box, Paper, Grid } from "@material-ui/core";
import { withEventBus, useEventBus } from "@components/EventBusProvider";
import { useState } from "react";
import Text from "../inputs/Text";
import Integer from "../inputs/Integer";
import Date from "../inputs/Date";

// This default export determines where your story goes in the story list
export default {
	title: "Step Form",
	component: StepForm
};

export const Step = withEventBus((props) => {
	const eb = useEventBus();
	const [form, setForm] = useState({
		data: {
			firstName: "Joe",
			lastName: "Bingo",
			age: 22,
			job: {
				startDate: "2015-10-01"
			}
		},
		errors: false
	});

	const setSubmittedData = (data) => setForm({ data, errors: false });
	const setErrors = (errors) => setForm({ data: form.data, errors });

	const askValidation = () => eb.send("person:validate");

	return (
		<Box width="75%">
			<StepForm
				formId="person"
				data={form.data}
				onSubmit={setSubmittedData}
				onError={setErrors}
			>
				<Grid container>
					<Grid item sm={5}>
						<Text label="Prénom" name="firstName" autoFocus={true} />
					</Grid>
					<Grid item sm={5}>
						<Text label="Nom" name="lastName" required={true} />
					</Grid>
					<Grid item sm={2}>
						<Integer
							label="Age"
							name="age"
							required={true}
							plage={[0, 150]}
						/>
					</Grid>
					<Grid item sm={6}>
						<Text label="Profession" name="job.title" required={true} />
					</Grid>
					<Grid item sm={3}>
						<Date
							label="Date d'arrivée"
							name="job.startDate"
							required={true}
						/>
					</Grid>
					<Grid item sm={3}>
						<Date label="Date de départ" name="job.endDate" />
					</Grid>
				</Grid>
			</StepForm>
			<button onClick={askValidation}>Validate</button>
			<Grid container spacing={4}>
				<Grid item sm={6}>
					<Paper>
						<h2>Submitted Data</h2>
						<pre style={{ width: "100%" }}>
							<code>{JSON.stringify(form.data, null, "\t")}</code>
						</pre>
					</Paper>
				</Grid>
				<Grid item sm={6}>
					<Paper>
						<h2>Validation Error</h2>
						<pre style={{ color: "red", width: "100%" }}>
							<code>{JSON.stringify(form.errors, null, "\t")}</code>
						</pre>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
});
