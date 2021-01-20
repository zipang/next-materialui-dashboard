import { createMuiTheme } from "@material-ui/core/styles";

let theme = createMuiTheme({
	palette: {
		primary: {
			main: "#009be5",
			light: "#63ccff",
			dark: "#006db3"
		},
		secondary: {
			main: "#faa41a",
			light: "#fbb037",
			dark: "#faa00f"
		},
		success: {
			main: "#aeea00",
			light: "#e4ff54",
			dark: "##c6ff00"
		},
		background: {
			light: "#eaeff1",
			main: "#eaeff1",
			dark: "#404854",
			darker: "#222"
		}
	},
	typography: {
		htmlFontSize: 16,
		h5: {
			fontWeight: 500,
			fontSize: 26,
			letterSpacing: 0.5
		},
		body1: {
			fontSize: "1rem",
			lineHeight: "1.25rem"
		}
	},
	shape: {
		borderRadius: 0
	},
	components: {
		MuiTab: {
			defaultProps: {
				disableRipple: true
			}
		}
	},
	mixins: {
		toolbar: {
			minHeight: 48
		}
	}
});
theme = {
	...theme,
	overrides: {
		MuiDrawer: {
			paper: {
				backgroundColor: "#18202c"
			}
		},
		MuiButton: {
			label: {
				textTransform: "none"
			},
			contained: {
				boxShadow: "none",
				"&:active": {
					boxShadow: "none"
				},
				"&:hover": {
					color: "lighter"
				}
			}
		},
		MuiTabs: {
			root: {
				marginLeft: theme.spacing(1)
			},
			indicator: {
				height: 3,
				borderTopLeftRadius: 3,
				borderTopRightRadius: 3,
				backgroundColor: theme.palette.common.white
			}
		},
		MuiTab: {
			root: {
				textTransform: "none",
				margin: "0 16px",
				minWidth: 0,
				padding: 0,
				[theme.breakpoints.up("md")]: {
					padding: 0,
					minWidth: 0
				}
			}
		},
		MuiIconButton: {
			root: {
				padding: theme.spacing(1)
			}
		},
		MuiDivider: {
			root: {
				backgroundColor: theme.palette.background.dark
			}
		},
		MuiFormControl: {
			root: {
				display: "block",
				margin: "1.2em 0 0.2em"
			}
		},
		MuiInputBase: {
			root: {
				backgroundColor: theme.palette.common.white
			}
		},
		MuiOutlinedInput: {
			inputMarginDense: {
				padding: "0.5rem"
			}
		},
		MuiFormLabel: {
			root: {
				backgroundColor: theme.palette.common.white
			}
		},
		MuiInputLabel: {
			root: {
				zIndex: 10
			},
			shrink: {
				transform: "translate(0.9em, -0.5em) scale(0.75)"
			}
		},
		MuiSelect: {
			root: {
				//margin: "0.5em 0 0.25em 0"
			},
			select: {
				minWidth: "30ch"
			}
		},

		MuiFormHelperText: {
			root: {
				margin: 0,
				fontSize: "0.8rem",
				marginTop: "3px",
				lineHeight: 1
			}
		},
		MuiListItemText: {
			primary: {
				fontWeight: theme.typography.fontWeightMedium
			}
		},
		MuiListItemIcon: {
			root: {
				color: "inherit",
				marginRight: 0,
				"& svg": {
					fontSize: 20
				}
			}
		},
		MuiAvatar: {
			root: {
				width: 48,
				height: 48
			}
		}
	}
};

export default theme;
