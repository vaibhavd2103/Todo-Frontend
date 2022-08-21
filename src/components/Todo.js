import React from "react";
import Moment from "react-moment";
import { baseUrl, useWindowDimensions } from "../constants/constants";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";

function Todo({
	item,
	color,
	setGetTodoTrigger,
	getTodoTrigger,
	hoverTodo,
	setHoverTodo,
	editTodoUI,
	setDeleteModal,
	setSelectedTodo,
}) {
	const { width, height } = useWindowDimensions();

	const completeTodo = async () => {
		await axios
			.post(`${baseUrl}/completeTodo`, {
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
		<div
			style={{
				display: "flex",
				alignItems: "center",
				marginBottom: 20,
				marginRight: width < 1000 ? 0 : 15,
			}}
		>
			<div
				style={{
					backdropFilter: hoverTodo === item?._id ? "blur(50px)" : "none",
					backgroundColor: hoverTodo === item?._id ? "#0003" : `${color}`,
					// backgroundColor: `${color}`,
					borderRadius: 10,
					padding: 10,
					paddingInline: 20,
					width: "30vw",
					boxShadow: "5px 5px 10px #0007",
					display: "flex",
					minWidth: width < 1000 ? "calc(65vw - 20px)" : 300,
					marginInline: 10,
					position: "relative",
					translateZ: "0px",
					backfaceVisibility: "hidden",
					paddingBottom: 15,
					// transition: "250ms",
				}}
				onClick={() => {
					setHoverTodo(item?._id);
				}}
				onMouseEnter={() => {
					// setTimeout(() => {
					setHoverTodo(item?._id);
					// }, 500);
				}}
				onMouseLeave={() => {
					setHoverTodo("");
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						transition: "250ms",
						paddingBottom: 10,
					}}
				>
					<>
						<a
							style={{
								color: "#fff",
								fontSize: 16,
								textAlign: "left",
								// width: "calc(50vw - 10px)",
								textShadow: "3px 3px 5px #0007",
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
					</>
					{hoverTodo === item?._id && (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: 10,
							}}
						>
							<div
								style={{
									cursor: "pointer",
									backgroundColor: "#f57",
									padding: 8,
									paddingInline: 15,
									borderRadius: 10,
									marginLeft: 10,
									boxShadow: "5px 5px 10px #0007",
									transition: "500ms",
									opacity: hoverTodo === item?._id ? 1 : 0,
									transform: `scale(${hoverTodo === item?._id ? 1 : 0})`,
								}}
								onClick={() => {
									setSelectedTodo(item);
									setDeleteModal(true);
								}}
							>
								<DeleteForeverIcon sx={{ color: "#fff" }} fontSize="small" />
							</div>
							<div
								style={{
									cursor: "pointer",
									// backgroundColor: color,
									backgroundColor: "#16f",
									padding: 8,
									paddingInline: 15,
									borderRadius: 10,
									marginLeft: 10,
									boxShadow: "5px 5px 10px #0007",
									transition: "500ms",
									opacity: hoverTodo === item?._id ? 1 : 0,
									transform: `scale(${hoverTodo === item?._id ? 1 : 0})`,
								}}
								onClick={() => editTodoUI(item)}
							>
								<EditIcon sx={{ color: "#fff" }} fontSize="small" />
							</div>
						</div>
					)}
				</div>
			</div>
			<div
				style={{
					cursor: "pointer",
					backgroundColor: "#595",
					padding: 8,
					paddingInline: 20,
					borderRadius: 10,
					boxShadow: "5px 5px 10px #0007",
				}}
				onClick={completeTodo}
			>
				<DoneAllIcon sx={{ color: "#fff" }} fontSize="medium" />
			</div>
		</div>
	);
}

export default Todo;
