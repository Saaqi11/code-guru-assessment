import React from 'react';
import Api from "@/src/Api.jsx";
import ExpenseListing from "@/src/Pages/user/expense/ExpenseListing.jsx";


class Dashboard extends React.Component {
	constructor() {
		super();
		this.state = {
			data: [],
			loading: true,
			searchText: '',
		}
	}
	
	componentDidMount() {
		this.fetchData();
	}
	
	fetchData = () => {
		Api.get("get-expenses")
			.then(res => {
				if(res.status === 200){
					this.setState({
						data: res.data.result,
						loading: false,
					});
				}
			});
	}
	
	handleSearch = (e) => {
		this.setState({ searchText: e.target.value });
	};
	
	logout = () => {
		Api.post('/do-logout', {}).then(res => {
			if(res.     status === 200){
				localStorage.clear();
				window.location.href = '/';
			}
		});
	}
	
	render() {
		return (
			<div className="flex flex-col h-screen bg-gray-100">
				<div className="bg-white p-4 flex justify-between items-center shadow-md">
					<button className="text-blue-800 font-semibold">Code Guru Assessment</button>
					<button className="text-red-600 font-semibold" onClick={this.logout}>Logout</button>
				</div>
				
				<div className="flex flex-1">
					<div className="bg-blue-800 text-white w-1/5 p-4">
						<h1 className="text-xl font-semibold mb-4">Dashboard</h1>
						<ul className="space-y-2">
							<li>
								<a href="#" className="block hover:text-blue-300">Expenses</a>
							</li>
						</ul>
					</div>
					
					{/* Main Content */}
					<div className="flex-1 p-8">
						<div className="bg-white rounded-lg shadow-md p-6">
							Welcome to your dashboard!
						</div>
						<br/>
						<div className="bg-white rounded-lg shadow-md p-6">
							{this.state.data ?
								<ExpenseListing
									expenses={this.state}
								/>
								: ""
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
