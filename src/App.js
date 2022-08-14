import logo from "./logo.svg";
import "./App.css";
import Auth from "./screens/Auth";
import { Route, Routes } from "react-router";
import Dashboard from "./screens/Dashboard";
import { useEffect } from "react";

function App() {
	// useEffect(() => {
	// 	const user = localStorage.getItem("user");
	// 	if (user) {
	// 		window.open("/dashboard");
	// 	}
	// }, []);

	return (
		<div className="App">
			<Routes>
				<Route element={<Auth />} path="/" exact />
				<Route element={<Dashboard />} path="/dashboard" exact />
			</Routes>
		</div>
	);
}

export default App;
