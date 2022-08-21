import React from "react";
import Moment from "react-moment";
import { baseUrl, useWindowDimensions } from "../constants/constants";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";

function CompletedTodo({ item, color, setGetTodoTrigger, getTodoTrigger }) {
	const { width, height } = useWindowDimensions();

	const undoTodo = async () => {
		await axios
			.post(`${baseUrl}/undoTodo`, {
				todo_id: item?._id,
			})
			.then((resp) => {
				console.log("====", resp?.data);
				setGetTodoTrigger(!getTodoTrigger);
			})
			.catch((err) => {
				console.log(err?.response?.data?.error);
			});
	};

	return (
		<div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
			<div
				style={{
					// backdropFilter: "blur(50px)",
					backgroundColor: `${color}ff`,
					borderRadius: 10,
					padding: 10,
					paddingInline: 20,
					width: "30vw",
					boxShadow: "5px 5px 10px #0007",
					display: "flex",
					minWidth: width < 1000 ? "calc(70vw - 20px)" : 300,
					marginInline: 10,
					position: "relative",
					translateZ: "0px",
					backfaceVisibility: "hidden",
					paddingBottom: 30,
				}}
			>
				<a
					style={{
						color: "#fff",
						fontSize: 16,
						textAlign: "left",
						// width: "calc(50vw - 10px)",
						textShadow: "3px 3px 5px #0007",
						// textDecorationLine: "line-through",
					}}
				>
					{item?.todo}
				</a>
				<div
					style={{
						display: "flex",
						position: "absolute",
						bottom: 5,
						right: 10,
					}}
				>
					<a
						style={{
							color: "#fff",
							fontSize: 10,
							textAlign: "right",
						}}
					>
						<Moment format="D MMM YYYY" withTitle>
							{item?.created_at}
						</Moment>
					</a>
					<a
						style={{
							color: "#fff",
							fontSize: 10,
							textAlign: "right",
							marginLeft: 7,
						}}
					>
						<Moment format="hh:mm">{item?.created_at}</Moment> PM
					</a>
				</div>
			</div>
			<a
				onClick={undoTodo}
				style={{
					color: "#fff",
					fontSize: 14,
					cursor: "pointer",
					padding: 10,
					backgroundColor: "#0007",
					borderRadius: 10,
					textShadow: "3px 3px 5px #0007",
					marginRight: width < 1000 ? 0 : 10,
				}}
			>
				Undo
			</a>
		</div>
	);
}

export default CompletedTodo;
