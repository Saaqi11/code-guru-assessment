import React, { useState } from 'react';
import Api from "@/src/Api.jsx";
import {Navigate} from "react-router-dom";

function OtpVerification(key) {
	const [otp, setOtp] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [resendMessage, setResendMessage] = useState('');
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	
	const handleVerify = (e) => {
		e.preventDefault();
		Api.post('/verify-email',
			{ otp }
		).then(res => {
			if (res.status === 200) {
				localStorage.setItem("user", JSON.stringify(res['data']['user']))
				setIsVerified(true);
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
	const handleResend = () => {
		setIsResendDisabled(true); // Disable resend button temporarily
		setResendMessage('Resending OTP...');
		
		Api.post(
			'/send-email-verification'
		).then(res => {
			if (res.status === 200) {
				setTimeout(() => {
					setIsResendDisabled(false);
					setResendMessage('OTP has been resent.');
				}, 2000); // Simulating a delay
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
	
	if (!isVerified) {
		return (
			<div className="flex justify-center items-center h-screen bg-gray-100">
				<div className="bg-white p-6 rounded shadow-md w-full max-w-xs">
					<h2 className="text-2xl mb-4">OTP Verification</h2>
					{errorMessage && (
						<div className="bg-red-100 text-red-600 py-2 px-3 mb-4 rounded">
							{errorMessage}
						</div>
					)}
					<form onSubmit={handleVerify}>
						<input
							className="w-full mb-4 p-2 border rounded"
							type="text"
							placeholder="Enter OTP"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
						/>
						<button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
							Verify OTP
						</button>
					</form>
					<p className="mt-2 text-center">
						<button
							className="text-blue-500"
							onClick={handleResend}
							disabled={isResendDisabled}
						>
							{resendMessage || 'Resend Verification Email'}
						</button>
					</p>
				</div>
			</div>
		);
	} else {
		return <Navigate to="/dashboard" replace={true} />;
	}
}

export default OtpVerification;
