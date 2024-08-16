import React, { useState } from 'react';
import './App.css';

function PatientTable({ requests }) {
 const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
 const [searchQuery, setSearchQuery] = useState('');

 const handleSearchChange = (event) => {
  setSearchQuery(event.target.value.toLowerCase());
};

  const filteredRequests = requests.filter((request) =>
    Object.values(request).some(
    (value) => value.toString().toLowerCase().indexOf(searchQuery) > -1
    )
  );

  const sortedRequests = React.useMemo(() => {
    let sortableRequests = [...filteredRequests];
    if (sortConfig.key) {
      sortableRequests.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRequests;
  }, [filteredRequests, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-header">
      <div className="search-bar">
      <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <h2>Patient Table</h2>
      <table>
        <thead>
          <tr>
            <th
              onClick={() => requestSort('index')}
              className={sortConfig.key === 'index' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Index▼": "Index"}  
            </th>
            <th
              onClick={() => requestSort('submissionDate')}
              className={sortConfig.key === 'submissionDate' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Submission Date▼": "Submission Date"}  
            </th>
            <th
              onClick={() => requestSort('lastName')}
              className={sortConfig.key === 'lastName' ? `sorted-${sortConfig.direction}` : ''}> 
              {sortConfig.direction === '' ? "Last Name▼": "Last Name"}
            </th>
            <th
              onClick={() => requestSort('membershipNumber')}
              className={sortConfig.key === 'membershipNumber' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Membership Number▼": "Membership Number"}
            </th>
            <th
              onClick={() => requestSort('status')}
              className={sortConfig.key === 'status' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Status▼": "Status"}
              
            </th>
            <th
              onClick={() => requestSort('principalProvider')}
              className={sortConfig.key === 'principalProvider' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Principal Provider▼": "Principal Provider"}  
            </th>
            <th
              onClick={() => requestSort('admissionDate')}
              className={sortConfig.key === 'admissionDate' ? `sorted-${sortConfig.direction}` : ''}>
              {sortConfig.direction === '' ? "Admission Date▼": "Admission Date"}  
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.index}</td>
              <td>{request.submissionDate}</td>
              <td>{request.lastName}</td>
              <td>{request.membershipNumber}</td>
              <td>{request.status}</td>
              <td>{request.principalProvider}</td>
              <td>{request.admissionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientTable;