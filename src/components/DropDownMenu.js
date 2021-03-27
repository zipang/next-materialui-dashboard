import { Paper, ClickAwayListener, Popper, MenuList, MenuItem } from "@material-ui/core";
import { useState } from "react";

const DropDownMenu = ({ anchorRef, actions = [] }) => {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	return (
		<Popper
			open={open}
			anchorEl={anchorRef.current}
			role={undefined}
			transition
			disablePortal
		>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{
						transformOrigin:
							placement === "bottom" ? "center top" : "center bottom"
					}}
				>
					<Paper>
						<ClickAwayListener onClickAway={() => setOpen(false)}>
							<MenuList
								autoFocusItem={open}
								id="menu-list-grow"
								onKeyDown={handleListKeyDown}
							>
								{actions.map((action, i) => (
									<MenuItem
										key={`menu-action-${i}`}
										onClick={action.callback}
									>
										{action.label}
									</MenuItem>
								))}
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);
};

export default DropDownMenu;
