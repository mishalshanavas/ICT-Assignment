// Task1: initiate app and run server at 3000

// Core and third-party modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path=require('path');
require('dotenv').config();

// Initialize express app BEFORE using it
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection 

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Define schema & model
const employeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        location: { type: String, trim: true },
        position: { type: String, trim: true },
        salary: { type: Number, min: 0 }
    },
    { timestamps: true }
);

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

// Connect to MongoDB Atlas if URI is provided
if (MONGODB_URI) {
    mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.error('MongoDB connection error:', err.message));
} else {
    console.warn('MONGODB_URI not set. Set it in .env to enable database operations.');
}


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find({}).lean();
        res.status(200).json(employees);
    } catch (err) {
        console.error('GET /api/employeelist error:', err);
        res.status(500).json({ message: 'Failed to fetch employees' });
    }
});




//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findById(id).lean();
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        console.error(`GET /api/employeelist/${id} error:`, err);
        res.status(400).json({ message: 'Invalid employee id' });
    }
});





//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body || {};
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const employee = await Employee.create({ name, location, position, salary });
        res.status(201).json(employee);
    } catch (err) {
        console.error('POST /api/employeelist error:', err);
        res.status(400).json({ message: 'Failed to create employee' });
    }
});






//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted', id });
    } catch (err) {
        console.error(`DELETE /api/employeelist/${id} error:`, err);
        res.status(400).json({ message: 'Invalid employee id' });
    }
});





//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body || {};
        if (!_id) return res.status(400).json({ message: 'Employee _id is required for update' });
        const update = { name, location, position, salary };
        Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
        const updated = await Employee.findByIdAndUpdate(_id, update, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updated);
    } catch (err) {
        console.error('PUT /api/employeelist error:', err);
        res.status(400).json({ message: 'Failed to update employee' });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



