import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AuthWrapper from "../components/AuthWrapper";
import { ACCESS_KEY, GOOGLE_CLIENT_ID } from "../constants/config";
import SettingsIcon from "@mui/icons-material/Settings";
// import GoogleLogin from "react-google-login";
import { gapi } from "gapi-script";
import { baseUrl } from "../constants/constants";

function Auth() {
	const [status, setStatus] = useState("login");
	const [bgImage, setBgImage] = useState(localStorage.getItem("bgImage"));
	const [color, setColor] = useState(localStorage.getItem("color"));
	const [images, setImages] = useState([]);
	const [error, setError] = useState("");

	const [photoModal, setPhotoModal] = useState(false);

	const changeStatus = (status) => {
		setStatus(status);
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	const navigate = useNavigate();

	const signUp = async () => {
		await axios
			.post(`${baseUrl}/signup`, {
				email: email,
				password: password,
				name: name,
				avatar_url: "https://www.w3schools.com/howto/img_avatar.png",
			})
			.then((resp) => {
				changeStatus("login");
				console.log("====", resp);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const login = async () => {
		if (email === "" || password === "") {
			setError("Email and  password cannot be empty");
		} else {
			await axios
				.post(`${baseUrl}/login`, {
					email: email,
					password: password,
				})
				.then((res) => {
					localStorage.setItem("token", res?.data?.token);
					localStorage.setItem("user", JSON.stringify(res?.data?.user));
					console.log(res.data);
					navigate("/dashboard");
				})
				.catch((err) => {
					console.log(err.response.data.title);
					setError(err.response.data.title);
				});
		}
	};

	const fetchImages = async () => {
		const backImage = localStorage.getItem("bgImage");
		if (!backImage) {
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
				console.log(res?.data?.results);
				setImages(res?.data?.results);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchImages();
		const initClient = () => {
			gapi.client.init({
				clientId: GOOGLE_CLIENT_ID,
				scope: "",
			});
		};
		gapi.load("client:auth2", initClient);
	}, []);

	const responseGoogle = (response) => {
		console.log(response);
	};

	// const googleSignUp = async (res) => {
	// 	console.log("------------------>", res);
	// 	const user = await res.profileObj;
	// 	const currentUser = {
	// 		email: user?.email,
	// 		name: user?.name,
	// 		avatar_url: user?.imageUrl,
	// 	};
	// 	await axios
	// 		.post(`${baseUrl}/googleSignup`, currentUser)
	// 		.then((resp) => {
	// 			// changeStatus("login");
	// 			console.log("====", resp);
	// 			navigate("/dashboard");
	// 			localStorage.setItem("user", JSON.stringify(resp?.data?.user));
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };

	// const googleLogin = async (res) => {
	// 	console.log("------------------>", res);
	// 	const user = await res.profileObj;
	// 	await axios
	// 		.post(`${baseUrl}/googleLogin`, {
	// 			email: user?.email,
	// 		})
	// 		.then((resp) => {
	// 			// changeStatus("login");
	// 			console.log("====", resp);
	// 			navigate("/dashboard");
	// 			localStorage.setItem("user", JSON.stringify(resp?.data?.user));
	// 			localStorage.setItem("token", user?.tokenObj?.access_token);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err.response.data.title);
	// 			setError(err.response.data.title);
	// 		});
	// };

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100vw",
					height: "100vh",
				}}
			>
				<img
					key={bgImage}
					src={bgImage}
					style={{
						width: "100vw",
						height: "100vh",
						position: "fixed",
						top: 0,
						objectFit: "cover",
					}}
				/>
				{status === "login" ? (
					<AuthWrapper>
						<a
							style={{
								fontWeight: "bold",
								fontSize: 30,
								marginBottom: 10,
								color: "#fff",
							}}
						>
							Login
						</a>
						<input
							placeholder="email"
							value={email}
							onChange={(text) => setEmail(text.target.value)}
							style={{
								height: 40,
								width: "30vw",
								minWidth: 300,
								marginTop: 20,
								marginBottom: 20,
								paddingLeft: 10,
								fontFamily: "Poppins",
								borderRadius: 10,
								outline: "none",
								border: 0,
							}}
						/>
						<input
							placeholder="password"
							value={password}
							onChange={(text) => setPassword(text.target.value)}
							style={{
								height: 40,
								width: "30vw",
								minWidth: 300,
								paddingLeft: 10,
								fontFamily: "Poppins",
								borderRadius: 10,
								outline: "none",
								border: 0,
							}}
						/>
						{error.length > 0 && (
							<a
								style={{
									color: "#f57",
									fontWeight: "bold",
									fontSize: 14,
									marginTop: 5,
								}}
							>
								{error}
							</a>
						)}
						<button
							style={{
								padding: 10,
								paddingInline: 50,
								marginTop: 20,
								fontFamily: "Poppins",
								borderRadius: 10,
								fontWeight: "bold",
								cursor: "pointer",
								fontSize: 16,
								outline: "none",
								border: 0,
								backgroundColor: color,
								color: "#fff",
							}}
							onClick={() => {
								login();
							}}
						>
							Login
						</button>
						<div style={{ marginTop: 10 }}>
							{/* <GoogleLogin
								clientId={GOOGLE_CLIENT_ID}
								buttonText="Sign in with Google"
								onSuccess={(res) => {
									googleLogin(res);
								}}
								onFailure={responseGoogle}
								cookiePolicy={"single_host_origin"}
								// isSignedIn={true}
								// style={{
								// 	backgroundColor: color,
								// 	marginTop: 10,
								// }}
							/> */}
						</div>
						<a style={{ marginTop: 20, color: "#fff" }}>
							Don't have an account?{" "}
							<button
								style={{
									padding: 3,
									paddingInline: 10,
									fontFamily: "Poppins",
									borderRadius: 10,
									cursor: "pointer",
									outline: "none",
									border: 0,
									backgroundColor: "#fff",
									color: color,
									fontWeight: "bold",
								}}
								onClick={() => {
									changeStatus("signup");
								}}
							>
								Signup
							</button>
						</a>
					</AuthWrapper>
				) : (
					<AuthWrapper>
						<a
							style={{
								fontWeight: "bold",
								fontSize: 30,
								marginBottom: 10,
								color: "#fff",
							}}
						>
							Signup
						</a>
						<input
							placeholder="name"
							value={name}
							onChange={(text) => setName(text.target.value)}
							style={{
								height: 40,
								width: "30vw",
								minWidth: 300,
								marginTop: 20,
								marginBottom: 20,
								paddingLeft: 10,
								fontFamily: "Poppins",
								fontFamily: "Poppins",
								borderRadius: 10,
								outline: "none",
								border: 0,
							}}
						/>
						<input
							placeholder="email"
							value={email}
							onChange={(text) => setEmail(text.target.value)}
							style={{
								height: 40,
								width: "30vw",
								minWidth: 300,
								marginBottom: 20,
								paddingLeft: 10,
								fontFamily: "Poppins",
								fontFamily: "Poppins",
								borderRadius: 10,
								outline: "none",
								border: 0,
							}}
						/>
						<input
							placeholder="password"
							value={password}
							onChange={(text) => setPassword(text.target.value)}
							style={{
								height: 40,
								width: "30vw",
								minWidth: 300,
								paddingLeft: 10,
								fontFamily: "Poppins",
								fontFamily: "Poppins",
								borderRadius: 10,
								outline: "none",
								border: 0,
							}}
						/>
						<button
							style={{
								padding: 10,
								paddingInline: 50,
								marginTop: 20,
								fontFamily: "Poppins",
								borderRadius: 10,
								fontWeight: "bold",
								cursor: "pointer",
								fontSize: 16,
								outline: "none",
								border: 0,
								backgroundColor: color,
								color: "#fff",
							}}
							onClick={() => {
								// navigate("/dashboard");
								signUp();
							}}
						>
							Sign up
						</button>
						<div style={{ marginTop: 10 }}>
							{/* <GoogleLogin
								clientId={GOOGLE_CLIENT_ID}
								buttonText="Sign up with Google"
								onSuccess={(res) => googleSignUp(res)}
								onFailure={responseGoogle}
								cookiePolicy={"single_host_origin"}
								// isSignedIn={true}
								// style={{
								// 	backgroundColor: color,
								// 	marginTop: 10,
								// }}
							/> */}
						</div>
						<a style={{ marginTop: 20, color: "#fff" }}>
							Already have an account?{" "}
							<button
								style={{
									padding: 3,
									paddingInline: 10,
									fontFamily: "Poppins",
									borderRadius: 10,
									cursor: "pointer",
									outline: "none",
									border: 0,
									backgroundColor: "#fff",
									color: color,
									fontWeight: "bold",
								}}
								onClick={() => {
									changeStatus("login");
								}}
							>
								Login
							</button>
						</a>
					</AuthWrapper>
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
							padding: 20,
							width: "75vw",
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
										}}
										src={item?.urls?.regular}
									/>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}

export default Auth;
