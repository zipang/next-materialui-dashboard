import CenteredPaperSheet from "@components/CenteredPaperSheet.js";
import DataTable from "./DataTable.js";

const testColumnsDef = [
	{ id: "firstName", label: "Prénom" },
	{ id: "lastName", label: "Nom" },
	{ id: "age", label: "Age", align: "right" },
	{ id: "address.city", label: "Ville" },
	{ id: "address.country", label: "Pays" }
];
const testRows = [
	{
		firstName: "John",
		lastName: "DOE",
		age: 36,
		address: { city: "Los Angeles", country: "USA" }
	},
	{
		firstName: "Jane",
		lastName: "DOE",
		age: 23,
		address: { city: "Los Angeles", country: "USA" }
	},
	{
		firstName: "Debbie",
		lastName: "HARRY",
		age: 25,
		address: { city: "New York City", country: "USA" }
	},
	{
		firstName: "David",
		lastName: "BOWIE",
		age: 42,
		address: { city: "London", country: "England" }
	},
	{
		firstName: "Joe",
		lastName: "STRUMMER",
		age: 38,
		address: { city: "London", country: "England" }
	},
	{
		firstName: "Iggy",
		lastName: "POP",
		age: 34,
		address: { city: "New York City", country: "USA" }
	}
];

// This default export determines where your story goes in the story list
export default {
	title: "Data Tables",
	component: DataTable
};

export const SortableSingerList = () => (
	<CenteredPaperSheet>
		<DataTable columns={testColumnsDef} rows={testRows} />
	</CenteredPaperSheet>
);
