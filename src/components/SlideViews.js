import { Box, Slide } from "@material-ui/core";
import { useState } from "react";

const SlideViewport = ({ children }) => (
	<Box
		overflow="hidden"
		width="100%"
		height="100%"
		position="relative"
		className="slider-viewport"
	>
		{children}
	</Box>
);
const SlideViews = ({ children, index = 0 }) => {
	const [state, setState] = useState({
		currentSlide: 0,
		direction: "right"
	});
	if (!children) return null;
	if (index !== state.currentSlide) {
		setState({
			currentSlide: index,
			slideIn: state.currentSlide <= index ? "left" : "right",
			slideOut: state.currentSlide <= index ? "right" : "left"
		});
	}
	const { currentSlide, slideIn, slideOut } = state;
	return (
		<SlideViewport>
			{Array.isArray(children)
				? children.map((component, i) => (
						<Slide
							in={i === currentSlide}
							direction={i === currentSlide ? slideIn : slideOut}
							mountOnEnter={true}
							unmountOnExit={true}
						>
							<Box width="100%" height="100%">
								{component}
							</Box>
						</Slide>
				  ))
				: { children }}
		</SlideViewport>
	);
};
export default SlideViews;
