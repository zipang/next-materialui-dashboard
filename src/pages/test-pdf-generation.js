import { createRef } from "react";
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Submit from "@components/forms/inputs/Submit";
import useFormStyles from "@components/forms/useFormStyles";
import { generateFromHtml } from "@lib/client/PdfApiClient";

const TestGenerationPdfPage = () => {
	const refHtml = createRef();
	const refInline = createRef();
	const styles = useFormStyles({
		minWidth: "1024px",
		"& label": {
			display: "block",
			width: "80%"
		}
	});
	/**
	 *
	 * @param {DOMEvent} evt
	 */
	const sendHtmlToConvert = async (evt) => {
		try {
			const html = refHtml.current.value;
			const inline = refInline.current.checked;
			if (inline) {
				return; // We will be directed to the API response (a PDF document inline)
			} else {
				evt.preventDefault();
				const { filename, content } = await generateFromHtml(
					"test.pdf",
					html,
					false
				);
				console.log(filename, content);
			}
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<CenteredPaperSheet xs={10} md={8}>
			<form
				className={styles.form}
				action="/api/pdf/test.pdf"
				method="POST"
				onSubmit={sendHtmlToConvert}
			>
				<h1>PDF Generation</h1>
				<label>
					Copy your HTML in the textarea
					<br />
					<textarea ref={refHtml} name="html" cols="120" rows="15"></textarea>
				</label>
				<label>
					See the generated PDF in the browser
					<br />
					<input ref={refInline} name="inline" type="checkbox" />
				</label>
				<Submit label="Send" />
			</form>
		</CenteredPaperSheet>
	);
};
export default TestGenerationPdfPage;
