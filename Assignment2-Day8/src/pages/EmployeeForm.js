import React, { useState } from 'react';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    location: '',
    salary: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Please enter a valid salary amount';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Since we don't need to post data to backend, just show success message
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        designation: '',
        location: '',
        salary: ''
      });
    }, 3000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      designation: '',
      location: '',
      salary: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="form-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Employee Added Successfully!</h2>
          <p>Employee details have been recorded.</p>
          <div className="submitted-details">
            <h3>Submitted Information:</h3>
            <div className="detail-item">
              <span>Name:</span> <strong>{formData.name}</strong>
            </div>
            <div className="detail-item">
              <span>Designation:</span> <strong>{formData.designation}</strong>
            </div>
            <div className="detail-item">
              <span>Location:</span> <strong>{formData.location}</strong>
            </div>
            <div className="detail-item">
              <span>Salary:</span> <strong>${parseFloat(formData.salary).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Add New Employee</h1>
        <p>Fill in the details to add a new employee to the system</p>
      </div>

      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter employee's full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="designation" className="form-label">
              Designation *
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={`form-input ${errors.designation ? 'error' : ''}`}
              placeholder="e.g., Software Engineer, Manager"
            />
            {errors.designation && <span className="error-message">{errors.designation}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="e.g., New York, Remote"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="salary" className="form-label">
              Salary (Annual) *
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`form-input ${errors.salary ? 'error' : ''}`}
              placeholder="e.g., 75000"
              min="0"
              step="1000"
            />
            {errors.salary && <span className="error-message">{errors.salary}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset Form
          </button>
          <button type="submit" className="btn-submit">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;