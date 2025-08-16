// NCC Attendance System - Main JavaScript File

// Cadet data array
const cadets = [
    { id: 1, name: "Cadet Arjun Kumar", rank: "Cadet Sergeant Major" },
    { id: 2, name: "Cadet Priya Sharma", rank: "Cadet Sergeant" },
    { id: 3, name: "Cadet Rajesh Patel", rank: "Cadet Corporal" },
    { id: 4, name: "Cadet Sneha Gupta", rank: "Cadet Lance Corporal" },
    { id: 5, name: "Cadet Vikram Singh", rank: "Cadet" },
    { id: 6, name: "Cadet Anita Reddy", rank: "Cadet" },
    { id: 7, name: "Cadet Rohit Verma", rank: "Cadet Corporal" },
    { id: 8, name: "Cadet Meera Joshi", rank: "Cadet Lance Corporal" },
    { id: 9, name: "Cadet Amit Shah", rank: "Cadet" },
    { id: 10, name: "Cadet Kavya Nair", rank: "Cadet Sergeant" },
    { id: 11, name: "Cadet Suresh Kumar", rank: "Cadet" },
    { id: 12, name: "Cadet Pooja Agarwal", rank: "Cadet Corporal" },
    { id: 13, name: "Cadet Ravi Krishnan", rank: "Cadet" },
    { id: 14, name: "Cadet Deepika Rao", rank: "Cadet Lance Corporal" },
    { id: 15, name: "Cadet Manoj Tiwari", rank: "Cadet" }
];

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Trigger show animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

function getAttendanceKey(date) {
    return `ncc_attendance_${date}`;
}

function saveAttendanceData(date, attendanceData) {
    try {
        const key = getAttendanceKey(date);
        localStorage.setItem(key, JSON.stringify(attendanceData));
        return true;
    } catch (error) {
        console.error('Error saving attendance data:', error);
        return false;
    }
}

function getAttendanceData(date) {
    try {
        const key = getAttendanceKey(date);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving attendance data:', error);
        return null;
    }
}

// Attendance recording functions
function loadAttendanceForDate(date) {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Get existing attendance data
    const existingData = getAttendanceData(date);
    
    // Generate table rows for each cadet
    cadets.forEach(cadet => {
        const row = document.createElement('tr');
        row.setAttribute('data-cadet-id', cadet.id);
        
        // Find existing attendance record
        const existingRecord = existingData ? 
            existingData.find(record => record.cadetId === cadet.id) : null;
        
        const isPresent = existingRecord ? existingRecord.status === 'present' : true;
        const reason = existingRecord ? existingRecord.reason || '' : '';
        
        row.innerHTML = `
            <td>
                <div class="cadet-info">
                    <div class="cadet-name">${cadet.name}</div>
                </div>
            </td>
            <td>
                <span class="cadet-rank">${cadet.rank}</span>
            </td>
            <td>
                <div class="attendance-controls">
                    <div class="radio-group">
                        <label class="radio-option present">
                            <input type="radio" name="attendance_${cadet.id}" value="present" ${isPresent ? 'checked' : ''}>
                            <i class="fas fa-check"></i> Present
                        </label>
                        <label class="radio-option absent">
                            <input type="radio" name="attendance_${cadet.id}" value="absent" ${!isPresent ? 'checked' : ''}>
                            <i class="fas fa-times"></i> Absent
                        </label>
                    </div>
                </div>
            </td>
            <td>
                <input type="text" class="reason-input" placeholder="Enter reason if absent..." 
                       value="${reason}" ${isPresent ? 'style="display: none;"' : ''}>
            </td>
        `;
        
        tableBody.appendChild(row);
        
        // Add event listeners for radio buttons
        const radioButtons = row.querySelectorAll('input[type="radio"]');
        const reasonInput = row.querySelector('.reason-input');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'absent') {
                    reasonInput.style.display = 'block';
                    reasonInput.focus();
                } else {
                    reasonInput.style.display = 'none';
                    reasonInput.value = '';
                }
            });
        });
    });
    
    // Show/hide view attendance button based on existing data
    const viewButton = document.getElementById('viewAttendance');
    if (viewButton) {
        viewButton.style.display = existingData ? 'inline-flex' : 'none';
    }
}

function markAllPresent() {
    const radioButtons = document.querySelectorAll('input[type="radio"][value="present"]');
    const reasonInputs = document.querySelectorAll('.reason-input');
    
    radioButtons.forEach(radio => {
        radio.checked = true;
    });
    
    reasonInputs.forEach(input => {
        input.style.display = 'none';
        input.value = '';
    });
    
    showNotification('All cadets marked as present', 'success');
}

function markAllAbsent() {
    const radioButtons = document.querySelectorAll('input[type="radio"][value="absent"]');
    const reasonInputs = document.querySelectorAll('.reason-input');
    
    radioButtons.forEach(radio => {
        radio.checked = true;
    });
    
    reasonInputs.forEach(input => {
        input.style.display = 'block';
    });
    
    showNotification('All cadets marked as absent. Please enter reasons.', 'info');
}

function saveAttendance() {
    const selectedDate = document.getElementById('attendanceDate').value;
    
    if (!selectedDate) {
        showNotification('Please select a date', 'error');
        return;
    }
    
    const attendanceData = [];
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    
    let hasErrors = false;
    
    rows.forEach(row => {
        const cadetId = parseInt(row.getAttribute('data-cadet-id'));
        const cadet = cadets.find(c => c.id === cadetId);
        
        const selectedRadio = row.querySelector('input[type="radio"]:checked');
        const reasonInput = row.querySelector('.reason-input');
        
        if (!selectedRadio) {
            showNotification(`Please select attendance status for ${cadet.name}`, 'error');
            hasErrors = true;
            return;
        }
        
        const status = selectedRadio.value;
        const reason = reasonInput.value.trim();
        
        // Validate that absent cadets have a reason
        if (status === 'absent' && !reason) {
            showNotification(`Please enter a reason for ${cadet.name}'s absence`, 'error');
            reasonInput.focus();
            hasErrors = true;
            return;
        }
        
        attendanceData.push({
            cadetId: cadetId,
            cadetName: cadet.name,
            cadetRank: cadet.rank,
            status: status,
            reason: status === 'absent' ? reason : null,
            timestamp: new Date().toISOString()
        });
    });
    
    if (hasErrors) return;
    
    // Save to localStorage
    if (saveAttendanceData(selectedDate, attendanceData)) {
        showNotification(`Attendance saved successfully for ${formatDate(selectedDate)}`, 'success');
        
        // Show view attendance button
        const viewButton = document.getElementById('viewAttendance');
        if (viewButton) {
            viewButton.style.display = 'inline-flex';
        }
    } else {
        showNotification('Error saving attendance data', 'error');
    }
}

// View attendance functions
function displayAttendanceRecords(date) {
    const displayDateElement = document.getElementById('displayDate');
    const attendanceRecordsContainer = document.getElementById('attendanceRecords');
    const presentCountElement = document.getElementById('presentCount');
    const absentCountElement = document.getElementById('absentCount');
    const totalCountElement = document.getElementById('totalCount');
    
    if (!attendanceRecordsContainer) return;
    
    // Set display date
    if (displayDateElement) {
        displayDateElement.textContent = formatDate(date);
    }
    
    // Get attendance data
    const attendanceData = getAttendanceData(date);
    
    if (!attendanceData || attendanceData.length === 0) {
        attendanceRecordsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No Attendance Records Found</h3>
                <p>No attendance has been recorded for this date.</p>
            </div>
        `;
        
        // Reset counters
        if (presentCountElement) presentCountElement.textContent = '0';
        if (absentCountElement) absentCountElement.textContent = '0';
        if (totalCountElement) totalCountElement.textContent = '0';
        
        return;
    }
    
    // Calculate statistics
    const presentCount = attendanceData.filter(record => record.status === 'present').length;
    const absentCount = attendanceData.filter(record => record.status === 'absent').length;
    const totalCount = attendanceData.length;
    
    // Update summary cards
    if (presentCountElement) presentCountElement.textContent = presentCount;
    if (absentCountElement) absentCountElement.textContent = absentCount;
    if (totalCountElement) totalCountElement.textContent = totalCount;
    
    // Generate records grid
    const recordsHTML = `
        <div class="records-grid">
            ${attendanceData.map(record => `
                <div class="cadet-record ${record.status}">
                    <div class="record-header">
                        <div class="record-name">${record.cadetName}</div>
                        <span class="record-status ${record.status}">
                            <i class="fas fa-${record.status === 'present' ? 'check' : 'times'}"></i>
                            ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                    </div>
                    <div class="record-rank">${record.cadetRank}</div>
                    ${record.reason ? `<div class="record-reason">
                        <i class="fas fa-comment"></i> ${record.reason}
                    </div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
    
    attendanceRecordsContainer.innerHTML = recordsHTML;
}

function downloadAttendanceCSV(date) {
    const attendanceData = getAttendanceData(date);
    
    if (!attendanceData || attendanceData.length === 0) {
        showNotification('No attendance data available for download', 'error');
        return;
    }
    
    // Create CSV content
    const headers = ['Cadet Name', 'Rank', 'Status', 'Reason', 'Date'];
    const csvContent = [
        headers.join(','),
        ...attendanceData.map(record => [
            `"${record.cadetName}"`,
            `"${record.cadetRank}"`,
            record.status,
            `"${record.reason || ''}"`,
            date
        ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `NCC_Attendance_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Attendance data downloaded successfully', 'success');
    } else {
        showNotification('Download not supported in this browser', 'error');
    }
}

// URL parameter handling for edit functionality
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize page based on URL parameters
function initializePage() {
    const dateParam = getURLParameter('date');
    if (dateParam && document.getElementById('attendanceDate')) {
        document.getElementById('attendanceDate').value = dateParam;
        loadAttendanceForDate(dateParam);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions for global access
window.NCCAttendance = {
    loadAttendanceForDate,
    markAllPresent,
    markAllAbsent,
    saveAttendance,
    displayAttendanceRecords,
    downloadAttendanceCSV,
    showNotification
};
