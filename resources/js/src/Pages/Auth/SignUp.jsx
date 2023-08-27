import React, { useState } from 'react';
import {Link, Navigate} from 'react-router-dom';
import Api from "@/src/Api.jsx";

export default function SignUp() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isRegistered, setIsRegistered] = useState(false);
	const handleSignup = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setErrorMessage('Passwords do not match.');
			return;
		}
		if (password === "" || email === "" ||confirmPassword) {
			setErrorMessage('Please fill all fields.');
			return;
		}
		await Api.post('/signup',
			{ email, password }
		).then(res => {
			if (res.status === 200) {
				setIsRegistered(true);
			}
		}).catch(error => {
			if (error) {
				const status = error.status;
				if (status === 401) {
					setErrorMessage(error.data.message);
				} else {
					setErrorMessage('An error occurred. Please try again later.');
				}
			} else {
				setErrorMessage('Network error. Please check your connection.');
			}
		});
	};
	if (!isRegistered) {
		return(
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
					<h2 className="text-2xl mb-4">Sign Up</h2>
					{errorMessage && (
						<div className="bg-red-100 text-red-600 py-2 px-3 mb-4 rounded">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleSignup}>
						<input
							className="w-full mb-4 p-2 border rounded"
							type="text"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							className="w-full mb-4 p-2 border rounded"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<input
							className="w-full mb-4 p-2 border rounded"
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">Sign Up</button>
					</form>
					<p className="mt-4 text-center">
						Already have an account? <Link to="/" className="text-blue-500">Log In</Link>
					</p>
				</div>
			</div>
		);
	} else {
		return <Navigate to="/otp-verify" replace={true} />;
	}
}
