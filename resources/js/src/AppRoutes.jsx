import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/src/Pages/Auth/Login";
import SignUp from "@/src/Pages/Auth/SignUp";
import OtpVerification from "@/src/Pages/Auth/OtpVerification";


class AppRoutes extends React.Component{
	render() {
		return (
			<BrowserRouter>
				<div>
					<Routes>
						<Route path={`/`}  element={<Login />} />
						<Route path={`/signup`}  element={<SignUp />} />
						<Route path={`/otp-verify`}  element={<OtpVerification />} />
					</Routes>
				</div>
			</BrowserRouter>
		);
	}
}

export default AppRoutes
