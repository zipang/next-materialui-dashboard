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
import { getProperty } from "@lib/utils/NestedObjects";
import { TableSortLabel } from "@material-ui/core";

const useStyles = makeStyles({
	root: {
		width: "100%"
	},
	container: {
		maxHeight: 440
	},

	table: {
		minWidth: 750
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
	}
});

const sortDirection = {
	asc: -1,
	desc: 1
};

/**
 *
 * @param {*} a
 * @param {*} b
 * @param {*} orderBy
 * @param {String} order
 */
const compare = (a, b, orderBy, order) => {
	const val1 = getProperty(a, orderBy, "");
	const val2 = getProperty(b, orderBy, "");
	return (val1 < val2 ? -1 : 1) * sortDirection[order];
};

/**
 *
 * @param {Array<Object>} rows
 * @param {String} orderBy
 * @param {String[asc|desc]} order
 */
const sortRows = (rows, orderBy, order) => {
	console.log(`Sort rows by ${orderBy} ${order}`, rows);
	const sorted = [...rows].sort((a, b) => compare(a, b, orderBy, order));
	console.log("Sorted", sorted);
	return sorted;
};

/**
 * @typedef ColumnDef
 * @field {String} id
 * @field {String} label
 * @field {String} align left|right|center
 */

/**
 * @typedef SortableTableHeadProps
 * @field {Array<ColumnDef>} columns
 * @field {String[asc|desc]} order Current sort order
 * @field {String} orderBy id of the current sorted column
 * @field {Function<event,string>} onRequestSort Handle the sort request
 * @field {Object} classes CSS style
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
 * @typedef DataTableProps
 * @field {Array<ColumnDef>} columns
 * @field {Array<Object>} rows
 */
/**
 * Display a sortable, searchable data tables
 * @param {DataTableProps} props
 */
const DataTable = ({ columns = [], rows = [] }) => {
	const classes = useStyles();
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
		<Paper className={classes.root}>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<SortableTableHead
						classes={classes}
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
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={`row-${i}`}
									>
										{columns.map((column) => {
											const value = getProperty(row, column.id, "");
											return (
												<TableCell
													key={column.id}
													align={column.align}
												>
													{column.format &&
													typeof value === "number"
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={changePage}
				onChangeRowsPerPage={changeRowsPerPage}
			/>
		</Paper>
	);
};

export default DataTable;
