import Input from "@components/forms/Input";
import APIForm from "../APIForm";

/**
 * Unformat the display format (takes only the digits and remove the spaces)
 * @param {String} str displayed format
 * @return {String}
 */
export const unformatSiret = (str = "") => str.replace(/[^\d]+/gi, "");

/**
 * Display SIRET code with spaces between blocks
 * 999 999 999 99999
 * @param {String} str current input value
 * @return {String}
 */
export const formatSiret = (str = "") => {
	const chars = unformatSiret(str).split("");
	return chars.reduce(
		(prev, cur, index) =>
			(index === 3 || index === 6 || index === 9
				? `${prev} ${cur}` // add a space between blocks
				: `${prev}${cur}`
			).substr(0, 17), // limit to 17 chars (14 + 3 spaces)
		""
	);
};

/**
 * A specific SIRET search for that sends sirets number to our internal API
 * which uses the Open Data
 * @param {Function} onSuccess Callback that receives the SIRET search API response data
 */
export const SiretSearchForm = ({ onSuccess }) => {
	return (
		<APIForm action="/api/siret/search" onSuccess={onSuccess}>
			<Input.Format
				label="No de Siret"
				name="siret"
				format={formatSiret}
				serialize={unformatSiret}
				autoFocus={true}
				validation={{ required: "Saisissez un no de SIRET valide (14 chiffres)" }}
			/>
			<Input.Integer
				label="Big number"
				name="data.no"
				autoFocus={true}
				validation={{ required: "Saisissez un nombre" }}
			/>
			<Input.Submit label="Rechercher" />
		</APIForm>
	);
};

export default {
	form: SiretSearchForm
};
