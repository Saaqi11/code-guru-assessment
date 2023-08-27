import React from 'react';
import DataTable from 'react-data-table-component';

class ExpenseListing extends React.Component {
	render() {
		const { data, loading, searchText } = this.props;
		
		if (data) {
			const filteredData = data.filter((item) =>
				item.name.toLowerCase().includes(searchText.toLowerCase())
			);
			
			const columns = [
				{ dataField: 'id', text: 'ID' },
				{ dataField: 'name', text: 'Name' },
				{ dataField: 'created_at', text: 'created_at' },
				{ dataField: 'updated_at', text: 'updated_at' },
				{ dataField: 'actions', text: 'actions' },
				// Add more columns as needed
			];
			
			if (loading) {
				return <p>Loading...</p>;
			}
			
			return (
				<div>
					<input
						type="text"
						value={searchText}
						onChange={this.handleSearch}
						placeholder="Search by name..."
					/>
					<DataTable
						columns={columns}
						data={filteredData}
						pagination
						paginationPerPage={10}
						paginationRowsPerPageOptions={[10, 20, 30]}
					/>
				</div>
			);
		} else {
			return (<p>There is not any record found</p>)
		}
		
	}
}
export default ExpenseListing;