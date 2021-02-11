import { createRef } from "react";
import CenteredPaperSheet from "@components/CenteredPaperSheet";
import Submit from "@components/forms/inputs/Submit";
import useFormStyles from "@components/forms/useFormStyles";
import PdfClient from "@lib/client/PdfClient";

const TestGenerationPdfPage = () => {
	const ref = createRef();
	const styles = useFormStyles({
		minWidth: "1024px"
	});
	/**
	 *
	 * @param {DOMEvent} evt
	 */
	const sendHtmlToConvert = async (evt) => {
		evt.preventDefault();
		try {
			const html = ref.current.value;
			const { filename, content } = await PdfClient.generateFromHtml(
				"test.pdf",
				html
			);
			console.log(filename, content);
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
					<textarea ref={ref} name="html" cols="80" rows="15"></textarea>
				</label>
				<Submit label="Send" />
			</form>
		</CenteredPaperSheet>
	);
};
export default TestGenerationPdfPage;
