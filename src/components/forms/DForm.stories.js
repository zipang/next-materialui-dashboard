// Input.stories.js
import Input from "./Input";
import DForm from "./DForm";
import JSON from "@lib/utils/JSON";
import { Box } from "@material-ui/core";
import { withEventBus, useEventBus } from "@components/EventBusProvider";
import { useState } from "react";

// This default export determines where your story goes in the story list
export default {
	title: "Programmable Form",
	component: DForm
};

export const ProgrammableForm = withEventBus((props) => {
	const eb = useEventBus();
	const [form, setForm] = useState({
		data: {},
		errors: false
	});
	const setSubmittedData = (data) => setForm({ data, errors: false });
	const setErrors = (errors) => setForm({ data: {}, errors });

	const askValidation = () => eb.send("person:validate");
	return (
		<Box width="50%">
			<DForm formId="person" onSubmit={setSubmittedData} onErrors={setErrors}>
				<Input.Text label="Prénom" name="firstName" autoFocus={true} />
				<Input.Text label="Nom" name="lastName" required />
				<Input.Integer label="Age" name="age" required min={0} />
			</DForm>
			<button onClick={askValidation}>Validate</button>
			<h2>Submitted Data</h2>
			<pre style={{ width: "100%" }}>
				<code>{JSON.stringify(form.data, null, "\t")}</code>
			</pre>
			<h2>Validation Error</h2>
			<pre style={{ color: "red", width: "100%" }}>
				<code>{JSON.stringify(form.errors, null, "\t")}</code>
			</pre>
		</Box>
	);
});
