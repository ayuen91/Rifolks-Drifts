import { useEffect } from "react";
import logo from "../assets/logo.png";

const Loading = () => {
	useEffect(() => {
		// Prevent scrolling while loading
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
			<div className="animate-pulse">
				<img
					src={logo}
					alt="Rifolks Drifts"
					className="w-48 h-48 object-contain opacity-80 animate-fade"
				/>
			</div>
		</div>
	);
};

export default Loading;
