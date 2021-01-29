/**
 * This hidden submit button is able to intercept the ENTER key event
 * to automatically submit the form
 * @see https://stackoverflow.com/questions/11525726/hiding-an-html-forms-submit-button/11526065
 */
export const HiddenSubmit = () => (
	<input type="submit" className="hidden" aria-hidden="true" />
);
