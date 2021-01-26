import { setProperty, getProperty } from "@lib/utils/NestedObjects";

function ValidationContext({ defaultValues = {} }) {
	this.fields = [];
	this.errors = {};
	this.data = { ...defaultValues }; // Clone the default values
}

ValidationContext.prototype = {
	register: function (name, { inputRef, validation, serialize, format }) {
		this.fields.push();
	}
};
