import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { getProperty } from "@lib/utils/NestedObjects.js";
import { Button, TableSortLabel } from "@material-ui/core";
import Link from "@components/Link.js";

const useStyles = makeStyles({
	root: {
		width: "100%"
	},
	container: {
		maxHeight: 480
	},

	table: {
		minWidth: 780
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1
	},
	inlineButton: {
		display: "inline-block",
		marginLeft: "2em"
	}
});

const sortDirection = {
	asc: -1,
	desc: 1
};

/**
 *
 * @param {Object} a
 * @param {Object} b
 * @param {String} orderBy Path to the property to compare
 * @param {String} order
 */
const compare = (a, b, orderBy, order) => {
	const val1 = getProperty(a, orderBy, "");
	const val2 = getProperty(b, orderBy, "");
	return (val1 < val2 ? -1 : 1) * sortDirection[order];
};

/**
 * @param {Array<Object>} rows
 * @param {String} orderBy Name of the field used for comparison (can be a path)
 * @param {String[asc|desc]} order
 * @return {Array<Object>} A new sorted array
 */
const sortRows = (rows, orderBy, order) => {
	return [...rows].sort((a, b) => compare(a, b, orderBy, order));
};

/**
 * @typedef ColumnDef
 * @property {String} id
 * @property {String} label
 * @property {String} align left|right|center
 */

/**
 * @typedef SortableTableHeadProps
 * @property {Array<ColumnDef>} columns
 * @property {String[asc|desc]} order Current sort order
 * @property {String} orderBy id of the current sorted column
 * @property {Function<event,string>} onRequestSort Handle the sort request
 * @property {Object} classes CSS style
 */

/**
 * Display clickable column headers to allow sorting
 * @param {SortableTableHeadProps} props
 */
function SortableTableHead({ columns, classes, order, orderBy, onRequestSort }) {
	// Create the sort handler for a particular column
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{columns.map((columnDef) => (
					<TableCell
						key={columnDef.id}
						align={columnDef.align}
						padding={columnDef.disablePadding ? "none" : "default"}
						sortDirection={orderBy === columnDef.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === columnDef.id}
							direction={orderBy === columnDef.id ? order : "desc"}
							onClick={createSortHandler(columnDef.id)}
						>
							{columnDef.label}
							{orderBy === columnDef.id ? (
								<span className={classes.visuallyHidden}>
									{order === "desc"
										? "sorted descending"
										: "sorted ascending"}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

/**
 * Display a pagination component
 * @param {PaginationProps} props
 */
const Pagination = ({ rows, rowsPerPage, page, changePage, changeRowsPerPage }) => (
	<TablePagination
		page={page}
		count={rows.length}
		rowsPerPage={rowsPerPage}
		rowsPerPageOptions={[50, 100]}
		onChangePage={changePage}
		onChangeRowsPerPage={changeRowsPerPage}
	/>
);

const noop = () => {};

/**
 * Display a single cell with formatted data,
 * hyperlinks, or action button..
 * @param {DataCellProps} props
 */
const DataCell = ({ column, row, styles, onAction = noop }) => {
	let button,
		action = false;
	const value = getProperty(row, column.id, "");
	const formattedValue = column.format ? column.format(value) : value;

	if (column.button) {
		button = column.button(row);
		if (button) {
			action = button.action;
		}
	}
	// let { label, action } = column.button ?  : { action: false };
	return (
		<TableCell key={column.id} align={column.align}>
			{column.link ? (
				<Link href={column.link(row)}>{formattedValue}</Link>
			) : (
				formattedValue
			)}
			{action && (
				<Button
					color="primary"
					size="small"
					className={styles.inlineButton}
					onClick={async () => {
						await action(row);
						onAction();
					}}
				>
					{button.label}
				</Button>
			)}
		</TableCell>
	);
};

/**
 * @typedef DataTableProps
 * @field {Array<ColumnDef>} columns
 * @field {Array<Object>} rows
 */
/**
 * Display a sortable, searchable data tables
 * @param {DataTableProps} props
 */
const DataTable = ({ columns = [], rows = [], onAction }) => {
	const styles = useStyles();
	const [order, setOrder] = useState("desc");
	const [orderBy, setOrderBy] = useState(columns[0]?.id);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(100);

	const changePage = (event, newPage) => {
		setPage(newPage);
	};

	const changeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const handleRequestSort = (event, property) => {
		if (property === orderBy) {
			// Revert the current order
			setOrder(order === "asc" ? "desc" : "asc");
		} else {
			setOrderBy(property);
			setOrder("desc"); // Allways start with descending order on new columns
		}
	};

	return (
		<Paper className={styles.root}>
			<TableContainer className={styles.container}>
				<Table stickyHeader aria-label="sticky table">
					<SortableTableHead
						classes={styles}
						columns={columns}
						orderBy={orderBy}
						order={order}
						onRequestSort={handleRequestSort}
					/>
					<TableBody>
						{sortRows(rows, orderBy, order)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, i) => {
								return (
									<TableRow hover tabIndex={-1} key={`row-${i}`}>
										{columns.map((column, j) => (
											<DataCell
												key={`cell-${i}-${j}`}
												styles={styles}
												column={column}
												row={row}
												onAction={onAction}
											/>
										))}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default DataTable;
