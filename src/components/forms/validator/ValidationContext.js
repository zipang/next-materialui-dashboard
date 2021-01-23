function ValidationContext({ mode = "onBlur", defaultValues = {} }) {
	this.fields = [];
	this.errors = {};
	this.data = { ...defaultValues }; // Clone the default values
}
