// Frontend JS for Attendance Manipulation System
const API = 'http://localhost:5000/api';
let token = '';
let user = null;
let allStudents = []; // To store student list for admin

// DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const dashboard = document.getElementById('dashboard');
const authSection = document.getElementById('auth-section');
const registerSection = document.getElementById('register-section');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// Toggle register/login
document.getElementById('show-register').onclick = e => {
  e.preventDefault();
  authSection.style.display = 'none';
  registerSection.style.display = 'block';
};
document.getElementById('show-login').onclick = e => {
  e.preventDefault();
  registerSection.style.display = 'none';
  authSection.style.display = 'block';
};

// Login
loginForm.onsubmit = async e => {
  e.preventDefault();
  loginError.textContent = '';
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.msg || 'Login failed');
    token = data.token;
    user = data.user;
    showDashboard();
  } catch (err) {
    loginError.textContent = err.message;
  }
};

// Signup
signupForm.onsubmit = async e => {
  e.preventDefault();
  signupError.textContent = '';
  const name = document.getElementById('signup-name').value;
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const studentClass = document.getElementById('signup-class').value;
  const email = document.getElementById('signup-email').value;
  
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password, role, email, class: studentClass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.msg || 'Signup failed');
    signupError.textContent = 'Signup successful! Please login.';
    signupError.style.color = 'green';
    setTimeout(() => {
      registerSection.style.display = 'none';
      authSection.style.display = 'block';
      signupForm.reset();
    }, 1500);
  } catch (err) {
    signupError.textContent = err.message;
    signupError.style.color = '#e74c3c';
  }
};

function showDashboard() {
  authSection.style.display = 'none';
  registerSection.style.display = 'none';
  dashboard.style.display = 'block';
  if (user.role === 'admin') {
    renderAdminDashboard();
  } else {
    renderStudentDashboard();
  }
}

// Admin dashboard: view/add/edit/delete attendance
async function renderAdminDashboard() {
  dashboard.innerHTML = `
    <div class="navbar">
      <h2>Admin Dashboard</h2>
      <button class="nav-btn" onclick="logout()">Logout</button>
    </div>
    <div style="margin-bottom:1.5rem;">
      <button class="nav-btn" onclick="showAddAttendance()">Add Attendance</button>
      <button class="nav-btn" onclick="loadAttendanceAdmin()">See Attendance</button>
      <button class="nav-btn" onclick="loadStudents()">Manage Students</button>
    </div>
    <div id="add-attendance" style="display:none;"></div>
    <div id="students-list" style="display:none;"></div>
    <div id="attendance-admin"></div>
  `;
  await loadStudents();
  await loadAttendanceAdmin();
}

// Load all students for admin
async function loadStudents() {
  try {
    const res = await fetch(`${API}/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.students)) {
      allStudents = data.students;
    }
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

function showAddAttendance() {
  document.getElementById('add-attendance').style.display = 'block';
  document.getElementById('students-list').style.display = 'none';
  renderAddAttendanceForm();
}

async function loadAttendanceAdmin() {
  const div = document.getElementById('attendance-admin');
  div.innerHTML = '<h3>All Attendance Records</h3>';
  try {
    const res = await fetch(`${API}/attendance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.attendance)) throw new Error('Failed to load');
    
    if (data.attendance.length === 0) {
      div.innerHTML += '<p>No attendance records yet.</p>';
      return;
    }
    
    div.innerHTML += `
      <table>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        ${data.attendance.map(r => `
          <tr>
            <td>${r.studentName}</td>
            <td>${r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</td>
            <td>${r.status}</td>
            <td>
              <button class='nav-btn' style='margin-right:5px;' onclick="deleteAttendance('${r._id}')">Delete</button>
            </td>
          </tr>
        `).join('')}
      </table>
    `;
  } catch (err) {
    div.innerHTML += '<p>Error loading records.</p>';
    console.error('Error loading attendance:', err);
  }
}

function renderAddAttendanceForm() {
  const div = document.getElementById('add-attendance');
  // Create dropdown for students
  const studentOptions = allStudents.map(s => 
    `<option value="${s._id}">${s.name} (${s.username})</option>`
  ).join('');
  
  div.innerHTML = `
    <h3>Add Attendance</h3>
    <form id="add-att-form">
      <select id="add-student-id" required>
        <option value="">Select Student</option>
        ${studentOptions}
      </select>
      <input type="date" id="add-date" required>
      <select id="add-status">
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="late">Late</option>
      </select>
      <button type="submit">Add</button>
    </form>
    <p id="add-att-error" class="error"></p>
  `;
  
  document.getElementById('add-att-form').onsubmit = async e => {
    e.preventDefault();
    const studentId = document.getElementById('add-student-id').value;
    const date = document.getElementById('add-date').value;
    const status = document.getElementById('add-status').value;
    
    try {
      const studentName = allStudents.find(s => s._id === studentId)?.name || '';
      const res = await fetch(`${API}/attendance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          date, 
          class: 'General',
          attendanceRecords: [{
            studentId,
            studentName,
            status
          }]
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add attendance');
      }
      
      div.style.display = 'none';
      await loadAttendanceAdmin();
    } catch (err) {
      document.getElementById('add-att-error').textContent = err.message;
    }
  };
}

async function deleteAttendance(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  
  try {
    const res = await fetch(`${API}/attendance/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error('Failed to delete');
    
    await loadAttendanceAdmin();
  } catch (err) {
    alert('Error deleting record: ' + err.message);
  }
}

// Student dashboard: view own attendance
async function renderStudentDashboard() {
  dashboard.innerHTML = `
    <div class="navbar">
      <h2>Student Dashboard - Welcome ${user.name}</h2>
      <button class="nav-btn" onclick="logout()">Logout</button>
    </div>
    <div id="attendance-student">
      <h3>Your Attendance Records</h3>
      <p>Loading your attendance...</p>
    </div>
  `;
  
  await loadStudentAttendance();
}

async function loadStudentAttendance() {
  const div = document.getElementById('attendance-student');
  
  try {
    const res = await fetch(`${API}/attendance?studentId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'Failed to load attendance');
    
    if (!Array.isArray(data.attendance) || data.attendance.length === 0) {
      div.innerHTML = '<p>No attendance records found.</p>';
      return;
    }
    
    // Calculate attendance stats
    const total = data.attendance.length;
    const present = data.attendance.filter(r => r.status === 'present').length;
    const absent = data.attendance.filter(r => r.status === 'absent').length;
    const late = data.attendance.filter(r => r.status === 'late').length;
    const attendanceRate = ((present + late * 0.5) / total * 100).toFixed(1);
    
    div.innerHTML = `
      <h3>Your Attendance Records</h3>
      <div class="stats">
        <div class="stat-card">
          <h4>Total Days</h4>
          <p>${total}</p>
        </div>
        <div class="stat-card">
          <h4>Present</h4>
          <p>${present}</p>
        </div>
        <div class="stat-card">
          <h4>Absent</h4>
          <p>${absent}</p>
        </div>
        <div class="stat-card">
          <h4>Late</h4>
          <p>${late}</p>
        </div>
        <div class="stat-card">
          <h4>Attendance Rate</h4>
          <p>${attendanceRate}%</p>
        </div>
      </div>
      <table>
        <tr>
          <th>Date</th>
          <th>Status</th>
        </tr>
        ${data.attendance.map(r => `
          <tr>
            <td>${r.date ? new Date(r.date).toLocaleDateString() : 'N/A'}</td>
            <td class="status-${r.status.toLowerCase()}">${r.status}</td>
          </tr>
        `).join('')}
      </table>
    `;
  } catch (err) {
    div.innerHTML = `<p>Error loading attendance: ${err.message}</p>`;
  }
}

function logout() {
  token = '';
  user = null;
  dashboard.style.display = 'none';
  authSection.style.display = 'block';
  // Reset forms
  loginForm.reset();
  signupForm.reset();
}