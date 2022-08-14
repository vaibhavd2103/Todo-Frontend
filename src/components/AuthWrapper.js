import React from "react";

function AuthWrapper(props) {
	return (
		<div
			style={{
				backgroundColor: "rgba(0,0,0,0.1)",
				// width: "50vw",
				// height: "300px",
				display: "flex",
				alignSelf: "center",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				borderRadius: 20,
				padding: 80,
				backdropFilter: "blur(20px)",
				minWidth: 200,
				boxShadow: "7px 7px 10px rgba(0,0,0,0.5)",
			}}
		>
			{props.children}
		</div>
	);
}

export default AuthWrapper;
