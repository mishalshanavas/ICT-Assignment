class StudentRegistration {
    constructor() {
      this.students = [];
      this.nextId = 6; // Starting from 6 since we have 5 sample students
      this.init();
    }
  
    init() {
      this.form = document.getElementById('studentForm');
      this.tableBody = document.getElementById('studentsTableBody');
      this.setupEventListeners();
      this.setupAnimations();
    }
  
    setupEventListeners() {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Add ripple effect to submit button
      const submitBtn = document.querySelector('.submit-btn');
      submitBtn.addEventListener('click', this.createRipple);
      
      // Add focus effects to inputs
      const inputs = document.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('focus', this.handleInputFocus);
        input.addEventListener('blur', this.handleInputBlur);
      });
    }
  
    setupAnimations() {
      // Stagger animation for table rows
      const tableRows = document.querySelectorAll('.students-table tbody tr');
      tableRows.forEach((row, index) => {
        row.style.animationDelay = `${0.8 + (index * 0.1)}s`;
        row.classList.add('fade-in-row');
      });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.form);
      const studentData = {
        id: this.nextId.toString().padStart(3, '0'),
        name: formData.get('name'),
        email: formData.get('email'),
        gender: formData.get('gender'),
        branch: formData.get('branch')
      };
  
      // Validate email format
      if (!this.validateEmail(studentData.email)) {
        this.showNotification('Please enter a valid email address', 'error');
        return;
      }
  
      // Check for duplicate email
      if (this.isDuplicateEmail(studentData.email)) {
        this.showNotification('This email is already registered', 'error');
        return;
      }
  
      // Add student to array and table
      this.students.push(studentData);
      this.addStudentToTable(studentData);
      this.nextId++;
  
      // Show success message
      this.showNotification(
        `Welcome ${studentData.name}! Registration completed successfully.`,
        'success'
      );
  
      // Reset form with animation
      this.resetFormWithAnimation();
    }
  
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    isDuplicateEmail(email) {
      const existingEmails = Array.from(this.tableBody.querySelectorAll('tr'))
        .map(row => row.cells[2].textContent);
      return existingEmails.includes(email);
    }
  
    addStudentToTable(student) {
      const row = document.createElement('tr');
      row.className = 'new-student-row';
      row.innerHTML = `
        <td><span class="id-badge">${student.id}</span></td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.gender}</td>
        <td><span class="branch-tag ${student.branch.toLowerCase()}">${student.branch}</span></td>
      `;
  
      // Add entrance animation
      row.style.opacity = '0';
      row.style.transform = 'translateY(20px)';
      this.tableBody.appendChild(row);
  
      // Trigger animation
      setTimeout(() => {
        row.style.transition = 'all 0.5s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
      }, 100);
    }
  
    resetFormWithAnimation() {
      const formElements = this.form.querySelectorAll('input, select');
      
      formElements.forEach((element, index) => {
        setTimeout(() => {
          if (element.type === 'radio') {
            element.checked = false;
          } else {
            element.value = '';
          }
          
          // Add a subtle animation
          element.style.transform = 'scale(0.95)';
          setTimeout(() => {
            element.style.transform = 'scale(1)';
          }, 100);
        }, index * 50);
      });
    }
  
    createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('div');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
  
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('btn-ripple');
  
      const existingRipple = button.querySelector('.btn-ripple');
      if (existingRipple) {
        existingRipple.remove();
      }
  
      button.appendChild(ripple);
    }
  
    handleInputFocus(e) {
      const formGroup = e.target.closest('.form-group');
      if (formGroup) {
        formGroup.classList.add('focused');
      }
    }
  
    handleInputBlur(e) {
      const formGroup = e.target.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('focused');
      }
    }
  
    showNotification(message, type = 'info') {
      // Remove existing notifications
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-message">${message}</span>
        </div>
      `;

      // Add notification styles
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#000000' : type === 'error' ? '#000000' : '#000000'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-size: 0.875rem;
        font-weight: 400;
      `;

      document.body.appendChild(notification);

      // Trigger entrance animation
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);

      // Auto remove after 4 seconds
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }, 4000);
    }
  }
  
  // Initialize the application when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new StudentRegistration();
  });
  
// Add some additional CSS for animations
const additionalStyles = `
  .fade-in-row {
    animation: fadeInUp 0.5s ease both;
  }

  .notification-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .focused {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
  }

  .new-student-row {
    background: var(--bg-secondary) !important;
  }
`;  // Inject additional styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);