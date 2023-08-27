import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/src/Pages/Auth/Login";
import SignUp from "@/src/Pages/Auth/SignUp";
import OtpVerification from "@/src/Pages/Auth/OtpVerification";
import Dashboard from "@/src/Pages/user/Dashboard.jsx";


class AppRoutes extends React.Component{
	render() {
		return (
			<BrowserRouter>
				<div>
					<Routes>
						<Route path={`/`}  element={<Login />} />
						<Route path={`/signup`}  element={<SignUp />} />
						<Route path={`/otp-verify`}  element={<OtpVerification />} />
						<Route path={`/dashboard`}  element={<Dashboard />} />
					</Routes>
				</div>
			</BrowserRouter>
		);
	}
}

export default AppRoutes
