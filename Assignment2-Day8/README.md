# Employee Dashboard - React Application

A highly professional and aesthetic Employee Dashboard built with React, featuring a minimal monochrome design and responsive layout.

## Features

### 🏠 Dashboard/Home Page
- Displays employee data from external API (https://jsonplaceholder.typicode.com/users)
- Professional card-based layout showing:
  - Employee ID, Name, and Email
  - Phone, Company, and Location
  - Interactive action buttons
- Real-time statistics display
- Loading states and error handling
- Fully responsive design

### 📝 Employee Form
- Clean form with validation for:
  - Name (required, minimum 2 characters)
  - Designation (required)
  - Location (required)
  - Salary (required, numeric validation)
- Success confirmation with submitted data preview
- Form reset functionality
- Professional error handling and user feedback

### 🎨 Design Features
- Minimal monochrome color scheme
- Professional gradient backgrounds
- Smooth animations and hover effects
- Card-based layouts with subtle shadows
- Responsive design for all screen sizes
- Modern typography and spacing

### 🚀 Navigation
- Clean navigation bar with active state indicators
- React Router for seamless page transitions
- Professional branding with "Employee Hub" logo

## Technology Stack

- **React 18.2.0** - Modern React with hooks
- **React Router DOM 6.8.0** - Client-side routing
- **CSS3** - Custom styling with gradients, animations, and responsive design
- **Fetch API** - For external data retrieval

## Installation & Setup

1. Navigate to the project directory:
   ```bash
   cd Assignment2-Day8
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   └── Navbar.css         # Navigation styles
├── pages/
│   ├── Dashboard.js       # Home/Dashboard page
│   ├── Dashboard.css      # Dashboard styles
│   ├── EmployeeForm.js    # Employee form page
│   └── EmployeeForm.css   # Form styles
├── App.js                 # Main app component with routing
├── App.css                # Global styles
└── index.js               # React DOM entry point
```

## API Integration

The application fetches employee data from:
- **Endpoint**: `https://jsonplaceholder.typicode.com/users`
- **Method**: GET
- **Response**: JSON array of user objects

## Design Philosophy

This application follows a **minimal monochrome aesthetic** with:
- **Color Palette**: Black, white, and various shades of gray
- **Typography**: Clean, modern sans-serif fonts
- **Layout**: Card-based design with ample whitespace
- **Interactions**: Subtle animations and hover effects
- **Responsiveness**: Mobile-first approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Optimized component rendering
- Efficient API data fetching
- Smooth CSS transitions
- Responsive images and layouts
- Minimal bundle size

---

**Note**: This is a frontend-only application. The employee form does not submit data to any backend service as per requirements.