import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Api from "@/src/Api.jsx";

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isAuthenticate, setIsAuthenticate] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === "" || email === "") {
			setErrorMessage('Please fill all fields.');
			return;
		}
		Api.post('/login',
			{ email, password }
		).then(res => {
			if (res.status === 200) {
				setIsAuthenticate(true);
				localStorage.setItem('authToken', res['data']['authToken'])
				localStorage.setItem('user', JSON.stringify(res['data']['user']))
			}
		}).catch(error => {
			if (error) {
				const status = error.status;
				if (status === 401) {
					setErrorMessage('Invalid credentials. Please try again.');
				} else {
					setErrorMessage('An error occurred. Please try again later.');
				}
			} else {
				setErrorMessage('Network error. Please check your connection.');
			}
		});
	};
	if (!isAuthenticate) {
		return(
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
					<h2 className="text-2xl mb-4">Login</h2>
					{errorMessage && (
						<div className="bg-red-100 text-red-600 py-2 px-3 mb-4 rounded">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleSubmit}>
						<input
							className="w-full mb-4 p-2 border rounded"
							value={email} type="text"
							placeholder="Username"
							required={true}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							className="w-full mb-4 p-2 border rounded"
							value={password}
							type="password"
							placeholder="Password"
							required={true}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Login</button>
					</form>
					<p className="mt-4 text-center">
						For sign up? <Link to="/signup" className="text-blue-500"> Sign Up</Link>
					</p>
				</div>
			</div>
		);
	} else {
		return <Navigate to="/dashboard" replace={true} />;
	}
}
