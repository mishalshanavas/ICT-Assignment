import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <h3>Error loading data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Manage and view employee information</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{employees.length}</h3>
          <p>Total Employees</p>
        </div>
        <div className="stat-card">
          <h3>{employees.filter(emp => emp.company).length}</h3>
          <p>Active Companies</p>
        </div>
        <div className="stat-card">
          <h3>{new Set(employees.map(emp => emp.address?.city)).size}</h3>
          <p>Locations</p>
        </div>
      </div>

      <div className="employee-grid">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-header">
              <div className="employee-avatar">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <p className="employee-id">ID: {employee.id}</p>
              </div>
            </div>
            
            <div className="employee-details">
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{employee.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{employee.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Company:</span>
                <span className="value">{employee.company?.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">City:</span>
                <span className="value">{employee.address?.city}</span>
              </div>
            </div>

            <div className="employee-actions">
              <button className="btn-primary">View Details</button>
              <button className="btn-secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;