/**
 * Label a group of controls
 * and draw a box around them
 * @param {PropsWithChildren} props
 * @param {String} props.label
 */
const GroupLabel = ({ label = "", children }) => (
	<label
		className="MuiTypography-body1"
		style={{ display: "block", padding: "0.5em", border: "1px solid #ccc" }}
	>
		{label}
		{children}
	</label>
);

export default GroupLabel;
