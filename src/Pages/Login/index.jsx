import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import API from "../../api/api"
//import authHeader from '../../auth/auth-header';



const Login = () => {
	const [data, setData] = useState({ username: "", password: ""});
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
			//try{
			//const url = API + "/api/login";
			// const { data: res } = await API.post("/api/login", data);
				// localStorage.setItem("token", JSON.parse(k));
				API.post('/api/login',data)
            	.then(response=> {
				// localStorage.setItem("token", JSON.stringify(response));
				// var tokenData = JSON.parse(localStorage.getItem('token'));
				let role = response.data.role;
				let token = response.data.token;
            	localStorage.setItem("role", role);
				localStorage.setItem("token", token);
				window.location = "/";
				
			})
			.catch(error => {
				if (
					error.response &&
					error.response.status >= 400 &&
					error.response.status <= 500
				) {
					setError(error.response.data.message);
				};
			});
 };

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="username"
							placeholder="Username"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						

						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sing In
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to="/register">
						<button type="button" className={styles.white_btn}>
							Sing Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
