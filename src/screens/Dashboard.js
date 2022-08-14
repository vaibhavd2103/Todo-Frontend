import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Todo from "../components/Todo";
import { useWindowDimensions } from "../constants/constants";
import CompletedTodo from "../components/CompletedTodo";
import { ACCESS_KEY } from "../constants/config";
import SettingsIcon from "@mui/icons-material/Settings";

function Dashboard() {
	const [user, setUser] = useState({});
	const [todos, setTodos] = useState([]);
	const [completedTodos, setCompletedTodos] = useState([]);
	const [getTodoTrigger, setGetTodoTrigger] = useState(false);
	const { width, height } = useWindowDimensions();
	const [bgImage, setBgImage] = useState(localStorage.getItem("bgImage"));
	const [color, setColor] = useState(localStorage.getItem("color"));
	const [images, setImages] = useState([]);
	const [photoModal, setPhotoModal] = useState(false);
	const [hoverTodo, setHoverTodo] = useState("");
	const [status, setStatus] = useState("Add");
	const [selectedTodo, setSelectedTodo] = useState("");
	const [deleteModal, setDeleteModal] = useState(false);
	let todoRef = useRef(null);

	useEffect(() => {
		const currentUser = localStorage.getItem("user");
		const user = JSON.parse(currentUser);
		setUser(user);
		getTodos(user);
	}, [getTodoTrigger]);

	const [todo, setTodo] = useState("");

	const addTodo = async () => {
		await axios
			.post("http://localhost:5000/addTodo", {
				todo: todo,
				user_id: user?._id,
				created_at: new Date(),
			})
			.then((resp) => {
				// console.log("====", resp?.data);
				setTodo("");
				setGetTodoTrigger(!getTodoTrigger);
			})
			.catch((err) => {
				console.log(err?.response?.data?.error);
			});
	};

	const getTodos = async (user) => {
		await axios
			.get(`http://localhost:5000/getTodos?user_id=${user?._id}`)
			.then((resp) => {
				// console.log("====>", resp?.data);
				// setTodos(resp?.data?.todos);
				let compTodos = resp?.data?.todos?.filter((item) => {
					if (item?.completed === true) {
						return item;
					}
				});
				// console.log(compTodos);
				setCompletedTodos(compTodos);
				let todos = resp?.data?.todos?.filter((item) => {
					if (item?.completed === false) {
						return item;
					}
				});
				setTodos(todos);
			})
			.catch((err) => {
				console.log(err?.response?.data?.error);
			});
	};

	const fetchImages = async () => {
		const backImage = localStorage.getItem("bgImage");
		if (backImage === "") {
			localStorage.setItem(
				"bgImage",
				"https://wallpaperset.com/w/full/d/f/7/186209.jpg"
			);
		}
		const bgColor = localStorage.getItem("bgImage");
		if (bgColor === "") {
			localStorage.setItem("bgImage", "#000");
		}
		await axios
			.get(
				`https://api.unsplash.com/search/photos?query=wallpaper&per_page=21&page=1`,
				{
					headers: {
						Authorization: `Client-ID ${ACCESS_KEY}`,
					},
				}
			)
			.then((res) => {
				// console.log(res?.data?.results);
				setImages(res?.data?.results);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const editTodoUI = (item) => {
		setTodo(item?.todo);
		setStatus("Edit");
		setSelectedTodo(item);

		todoRef.focus();
	};

	const editTodo = async () => {
		await axios
			.post(`http://localhost:5000/editTodo`, {
				todo_id: selectedTodo?._id,
				todo: todo,
				created_at: new Date(),
			})
			.then((resp) => {
				console.log("====", resp?.data);
				setGetTodoTrigger(!getTodoTrigger);
				setStatus("Add");
				setTodo("");
			})
			.catch((err) => {
				console.log(err?.response?.data?.error);
			});
	};

	// function editTodo() {
	// 	console.log("walla");
	// }

	useEffect(() => {
		fetchImages();
	}, []);

	const editOrAddFunc = () => {
		if (status === "Add") {
			addTodo();
		} else {
			editTodo();
		}
	};

	const deleteTodo = async () => {
		await axios
			.post(`http://localhost:5000/deleteTodo`, {
				todo_id: selectedTodo?._id,
			})
			.then((resp) => {
				console.log("====", resp?.data);
				setGetTodoTrigger(!getTodoTrigger);
			})
			.catch((err) => {
				console.log(err?.response?.data?.error);
			});
	};

	// const bgImage = localStorage.getItem("bgImage");
	// const color = localStorage.getItem("color");

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				// justifyContent: "center",
				width: "100vw",
				height: "100vh",
			}}
			onClick={() => {
				setHoverTodo("");
			}}
		>
			<div
				style={{
					display: "flex",
					width: "100vw",
					height: "100vh",
					backdropFilter: "blur(7px)",
					position: "fixed",
					top: 0,
					zIndex: -5,
				}}
			></div>
			<img
				key={bgImage}
				src={bgImage}
				style={{
					width: "100vw",
					height: "100vh",
					position: "fixed",
					top: 0,
					objectFit: "cover",
					zIndex: -10,
				}}
			/>
			<div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
				<img
					src={user?.avatar_url}
					alt="profile_photo"
					style={{
						width: 100,
						height: 100,
						borderRadius: 100,
					}}
				/>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginLeft: 10,
						alignItems: "flex-start",
					}}
				>
					<a
						style={{
							fontSize: 40,
							fontWeight: "bold",
							color: "#fff",
							textShadow: "3px 3px 5px #0007",
							textAlign: "left",
						}}
					>
						{user?.name}
					</a>
					<a
						style={{
							fontSize: 20,
							color: "#fff",
							textShadow: "3px 3px 5px #0007",
							textAlign: "left",
						}}
					>
						{user?.email}
					</a>
				</div>
			</div>
			{/* <form
			> */}
			<div
				style={{
					display: "flex",
					flexDirection: width < 500 ? "column" : "row",
					justifyContent: "center",
					alignItems: "center",
					marginTop: 20,
					marginBottom: 20,
				}}
			>
				<input
					value={todo}
					onChange={(e) => setTodo(e.target.value)}
					placeholder="Add what you want to do..."
					style={{
						height: 40,
						width: "40vw",
						paddingLeft: 10,
						fontFamily: "Poppins",
						paddingLeft: 10,
						borderRadius: 10,
						outline: "none",
						border: 0,
						minWidth: 300,
						boxShadow: "5px 5px 7px #0007",
						// paddingTop: 10,
					}}
					ref={(input) => (todoRef = input)}
				/>
				<button
					style={{
						padding: 10,
						paddingInline: 50,
						marginTop: width < 500 ? 20 : 0,
						fontFamily: "Poppins",
						backgroundColor: color,
						color: "#fff",
						borderRadius: 10,
						border: 0,
						boxShadow: "5px 5px 7px #0007",
						cursor: "pointer",
						marginLeft: 10,
					}}
					onClick={editOrAddFunc}
				>
					{status}
				</button>
			</div>
			{/* </form> */}
			<div
				style={{
					display: "flex",
					flexDirection: width < 1000 ? "column" : "row",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<a
						style={{
							color: "#fff",
							fontSize: 24,
							fontWeight: "bold",
							textAlign: "left",
							marginLeft: 20,
							textShadow: "4px 4px 5px #0007",
							marginBottom: 10,
						}}
					>
						To do's{" "}
						<span style={{ fontSize: 14, marginLeft: 5 }}>
							({todos?.length})
						</span>
					</a>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							overflowY: "auto",
							height: width < 1000 ? "100%" : "calc(100vh - 270px)",
						}}
					>
						{todos?.map((item) => {
							return (
								<div key={item?._id}>
									{item?.completed === false && (
										<Todo
											item={item}
											color={color}
											getTodoTrigger={getTodoTrigger}
											setGetTodoTrigger={setGetTodoTrigger}
											setHoverTodo={setHoverTodo}
											hoverTodo={hoverTodo}
											todoText={todo}
											setTodoText={setTodo}
											todoRef={todoRef}
											setStatus={setStatus}
											editTodoUI={editTodoUI}
											setSelectedTodo={setSelectedTodo}
											setDeleteModal={setDeleteModal}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginTop: width < 1000 ? 50 : 0,
						marginLeft: width < 1000 ? 0 : 15,
					}}
				>
					<a
						style={{
							color: "#fff",
							fontSize: 24,
							fontWeight: "bold",
							textAlign: "left",
							marginLeft: 20,
							textShadow: "4px 4px 5px #0007",
							marginBottom: 10,
						}}
					>
						Completed{" "}
						<span style={{ fontSize: 14, marginLeft: 5 }}>
							({completedTodos?.length})
						</span>
					</a>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							overflowY: "auto",
							height: width < 1000 ? "100%" : "calc(100vh - 270px)",
						}}
					>
						{completedTodos?.map((item) => {
							return (
								<div key={item?._id}>
									{item?.completed === true && (
										<CompletedTodo
											item={item}
											color={color}
											getTodoTrigger={getTodoTrigger}
											setGetTodoTrigger={setGetTodoTrigger}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
			{photoModal && (
				<div
					onClick={() => {
						setPhotoModal(false);
					}}
					style={{
						backgroundColor: "#0005",
						backdropFilter: "blur(5px)",
						height: "100vh",
						width: "100vw",
						display: "flex",
						flexDirection: "column",
						position: "fixed",
						top: 0,
						transition: "200ms",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "inline-block",
							backgroundColor: "#fff1",
							padding: 10,
							width: "75vw",
							minWidth: 300,
							overflowY: "auto",
						}}
					>
						{images?.map((item) => {
							return (
								<div
									key={item?.id}
									style={{
										display: "inline-block",
									}}
									onClick={() => {
										setBgImage(item?.urls?.full);
										setColor(item?.color);
										localStorage.setItem("color", item?.color);
										localStorage.setItem("bgImage", item?.urls?.full);
									}}
								>
									<img
										style={{
											height: "calc((80vw/3.3) * 0.6)",
											width: "calc(80vw/3.3)",
											objectFit: "cover",
											minWidth: 200,
											minHeight: 140,
										}}
										src={item?.urls?.small}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
			<div
				style={{
					position: "fixed",
					bottom: 40,
					right: 40,
					cursor: "pointer",
				}}
				onClick={() => {
					setPhotoModal(true);
				}}
			>
				<SettingsIcon sx={{ color: "#fff" }} fontSize="large" />
			</div>
			{deleteModal && (
				<div
					onClick={() => {
						setDeleteModal(false);
					}}
					style={{
						backgroundColor: "#0008",
						// backdropFilter: "blur(5px)",
						height: "100vh",
						width: "100vw",
						display: "flex",
						flexDirection: "column",
						position: "fixed",
						top: 0,
						transition: "200ms",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						style={{
							backdropFilter: "blur(50px)",
							backgroundColor: "#fff1",
							width: "50vw",
							paddingBlock: 30,
							borderRadius: 10,
							// boxShadow: "5px 5px 7px #0007",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<a
							style={{
								color: "#fff",
								fontSize: 18,
							}}
						>
							{selectedTodo?.todo}
						</a>
						<div
							style={{ display: "flex", alignItems: "center", marginTop: 40 }}
						>
							<div
								style={{
									cursor: "pointer",
									paddingBlock: 10,
									paddingInline: 20,
									borderRadius: 10,
									border: "solid 1px #f57",
								}}
								onClick={() => {
									setDeleteModal(false);
								}}
							>
								<a style={{ color: "#f57", fontSize: 18 }}>Cancel</a>
							</div>
							<div
								style={{
									cursor: "pointer",
									paddingBlock: 10,
									paddingInline: 20,
									borderRadius: 10,
									backgroundColor: "#f57",
									marginLeft: 40,
									border: "solid 1px #f570",
								}}
								onClick={() => {
									deleteTodo();
								}}
							>
								<a style={{ color: "#fff", fontSize: 18 }}>Delete</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Dashboard;
