// NCC Attendance System - Main JavaScript File

// Cadet data array sorted by year (1st, 2nd, 3rd)
const cadets = [
    // 1st Year Cadets
    {
        id: 5,
        name: "Cadet Vikram Singh",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 6,
        name: "Cadet Anita Reddy",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 9,
        name: "Cadet Amit Shah",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 11,
        name: "Cadet Suresh Kumar",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 13,
        name: "Cadet Ravi Krishnan",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 15,
        name: "Cadet Manoj Tiwari",
        rank: "Cadet",
        year: 1,
    },
    {
        id: 20,
        name: "Cadet Kiran Kumar",
        rank: "Cadet",
        year: 1,
    },
    
    // 2nd Year Cadets
    {
        id: 3,
        name: "Cadet Rajesh Patel",
        rank: "Cadet Corporal",
        year: 2,
    },
    {
        id: 4,
        name: "Cadet Sneha Gupta",
        rank: "Cadet Lance Corporal",
        year: 2,
    },
    {
        id: 7,
        name: "Cadet Rohit Verma",
        rank: "Cadet Corporal",
        year: 2,
    },
    {
        id: 8,
        name: "Cadet Meera Joshi",
        rank: "Cadet Lance Corporal",
        year: 2,
    },
    {
        id: 12,
        name: "Cadet Pooja Agarwal",
        rank: "Cadet Corporal",
        year: 2,
    },
    {
        id: 14,
        name: "Cadet Deepika Rao",
        rank: "Cadet Lance Corporal",
        year: 2,
    },
    {
        id: 18,
        name: "Cadet Rahul Mishra",
        rank: "Cadet Corporal",
        year: 2,
    },
    {
        id: 19,
        name: "Cadet Divya Singh",
        rank: "Cadet Lance Corporal",
        year: 2,
    },
    
    // 3rd Year Cadets
    {
        id: 1,
        name: "Cadet Arjun Kumar",
        rank: "Cadet Sergeant Major",
        year: 3,
    },
    {
        id: 2,
        name: "Cadet Priya Sharma",
        rank: "Cadet Sergeant",
        year: 3,
    },
    {
        id: 10,
        name: "Cadet Kavya Nair",
        rank: "Cadet Sergeant",
        year: 3,
    },
    {
        id: 16,
        name: "Cadet Sanjay Gupta",
        rank: "Cadet Under Officer",
        year: 3,
    },
    {
        id: 17,
        name: "Cadet Nisha Patel",
        rank: "Cadet Sergeant",
        year: 3,
    },
];

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    // Trigger show animation
    setTimeout(() => notification.classList.add("show"), 100);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            notification.style.display = "none";
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
        console.error("Error saving attendance data:", error);
        return false;
    }
}

function getAttendanceData(date) {
    try {
        const key = getAttendanceKey(date);
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error retrieving attendance data:", error);
        return null;
    }
}

// Enhanced functions
function updateAttendanceSummary() {
    const presentCount = document.querySelectorAll(
        'input[type="radio"][value="present"]:checked',
    ).length;
    const absentCount = document.querySelectorAll(
        'input[type="radio"][value="absent"]:checked',
    ).length;
    const visibleRows = document.querySelectorAll(
        '#attendanceTableBody tr:not([style*="display: none"])',
    ).length;

    const summarySection = document.getElementById("attendanceSummary");
    const presentElement = document.getElementById("previewPresent");
    const absentElement = document.getElementById("previewAbsent");
    const totalElement = document.getElementById("previewTotal");

    if (presentElement) presentElement.textContent = presentCount;
    if (absentElement) absentElement.textContent = absentCount;
    if (totalElement) totalElement.textContent = visibleRows;

    // Show summary if any selections made
    if (summarySection && (presentCount > 0 || absentCount > 0)) {
        summarySection.style.display = "block";
    }
}

function updateCadetCount(count) {
    const cadetCountElement = document.getElementById("cadetCount");
    if (cadetCountElement) {
        cadetCountElement.textContent = count;
    }
}

function applyFilters() {
    const selectedDate = document.getElementById("attendanceDate").value;
    if (selectedDate) {
        loadAttendanceForDate(selectedDate);
    }
}

function getFilteredCadets() {
    const yearFilter = document.getElementById("yearFilter")?.value || "all";
    const companyFilter =
        document.getElementById("companyFilter")?.value || "all";

    return cadets.filter((cadet) => {
        const yearMatch =
            yearFilter === "all" || cadet.year.toString() === yearFilter;
        const companyMatch =
            companyFilter === "all" || cadet.company === companyFilter;
        return yearMatch && companyMatch;
    });
}

function clearAllAttendance() {
    if (confirm("Are you sure you want to clear all attendance selections?")) {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        const reasonInputs = document.querySelectorAll(".reason-input");

        radioButtons.forEach((radio) => {
            radio.checked = false;
        });

        reasonInputs.forEach((input) => {
            input.style.display = "none";
            input.value = "";
        });

        const summarySection = document.getElementById("attendanceSummary");
        if (summarySection) {
            summarySection.style.display = "none";
        }

        showNotification("All attendance selections cleared", "info");
    }
}

function toggleSearch() {
    const searchSection = document.getElementById("searchSection");
    const searchInput = document.getElementById("searchInput");

    if (searchSection.style.display === "none") {
        searchSection.style.display = "block";
        searchInput.focus();
    } else {
        searchSection.style.display = "none";
        searchInput.value = "";
        filterCadets(); // Reset filter
    }
}

function filterCadets() {
    const searchTerm = document
        .getElementById("searchInput")
        .value.toLowerCase();
    const rows = document.querySelectorAll("#attendanceTableBody tr");

    rows.forEach((row) => {
        const cadetName = row
            .querySelector(".cadet-name")
            .textContent.toLowerCase();
        const cadetRank = row
            .querySelector(".cadet-rank")
            .textContent.toLowerCase();

        if (cadetName.includes(searchTerm) || cadetRank.includes(searchTerm)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function applyFilters() {
    // Re-load attendance for current date with new filters
    const currentDate = document.getElementById("dateInput")?.value || new Date().toISOString().split('T')[0];
    loadAttendanceForDate(currentDate);
}

function navigateToDate(currentDate, dayOffset) {
    // Get all stored attendance dates
    const storedDates = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('ncc_attendance_')) {
            const date = key.replace('ncc_attendance_', '');
            storedDates.push(date);
        }
    }
    
    if (storedDates.length === 0) {
        showNotification('No attendance records found', 'error');
        return;
    }
    
    // Sort dates
    storedDates.sort();
    
    // Find current date index
    const currentIndex = storedDates.indexOf(currentDate);
    
    let targetIndex;
    if (dayOffset > 0) {
        // Next day with data
        targetIndex = currentIndex < storedDates.length - 1 ? currentIndex + 1 : 0;
    } else {
        // Previous day with data  
        targetIndex = currentIndex > 0 ? currentIndex - 1 : storedDates.length - 1;
    }
    
    const targetDate = storedDates[targetIndex];
    window.location.href = `view.html?date=${targetDate}`;
}

// Attendance recording functions
function loadAttendanceForDate(date) {
    const tableBody = document.getElementById("attendanceTableBody");
    if (!tableBody) return;

    // Clear existing content
    tableBody.innerHTML = "";

    // Get existing attendance data
    const existingData = getAttendanceData(date);

    // Get current filters
    const yearFilter = document.getElementById("yearFilter")?.value || "all";

    // Filter cadets based on year filter only
    const filteredCadets = cadets.filter((cadet) => {
        const yearMatch =
            yearFilter === "all" || cadet.year.toString() === yearFilter;
        return yearMatch;
    });

    // Update cadet count
    updateCadetCount(filteredCadets.length);

    // Generate table rows for each filtered cadet
    filteredCadets.forEach((cadet) => {
        const row = document.createElement("tr");
        row.setAttribute("data-cadet-id", cadet.id);

        // Find existing attendance record
        const existingRecord = existingData
            ? existingData.find((record) => record.cadetId === cadet.id)
            : null;

        const isPresent = existingRecord
            ? existingRecord.status === "present"
            : true;
        const reason = existingRecord ? existingRecord.reason || "" : "";

        row.innerHTML = `
            <td>
                <div class="cadet-info">
                    <div class="cadet-name">${cadet.name}</div>
                </div>
            </td>
            <td>
                <span class="year-badge year-${cadet.year}">${cadet.year}${cadet.year === 1 ? "st" : cadet.year === 2 ? "nd" : "rd"} Year</span>
            </td>
            <td>
                <span class="cadet-rank">${cadet.rank}</span>
            </td>
            <td>
                <div class="attendance-controls">
                    <div class="radio-group">
                        <label class="radio-option present">
                            <input type="radio" name="attendance_${cadet.id}" value="present" ${isPresent ? "checked" : ""}>
                            <i class="fas fa-check"></i> Present
                        </label>
                        <label class="radio-option absent">
                            <input type="radio" name="attendance_${cadet.id}" value="absent" ${!isPresent ? "checked" : ""}>
                            <i class="fas fa-times"></i> Absent
                        </label>
                    </div>
                </div>
            </td>
            <td>
                <input type="text" class="reason-input" placeholder="Enter reason if absent..." 
                       value="${reason}" ${isPresent ? 'style="display: none;"' : ""}>
            </td>
        `;

        tableBody.appendChild(row);

        // Add event listeners for radio buttons
        const radioButtons = row.querySelectorAll('input[type="radio"]');
        const reasonInput = row.querySelector(".reason-input");

        radioButtons.forEach((radio) => {
            radio.addEventListener("change", function () {
                if (this.value === "absent") {
                    reasonInput.style.display = "block";
                    reasonInput.focus();
                } else {
                    reasonInput.style.display = "none";
                    reasonInput.value = "";
                }
                updateAttendanceSummary();
            });
        });
    });

    // Show/hide view attendance button based on existing data
    const viewButton = document.getElementById("viewAttendance");
    if (viewButton) {
        viewButton.style.display = existingData ? "inline-flex" : "none";
    }

    // Update summary preview
    updateAttendanceSummary();
}

function markAllPresent() {
    const visibleRows = document.querySelectorAll(
        '#attendanceTableBody tr:not([style*="display: none"])',
    );
    let count = 0;

    visibleRows.forEach((row) => {
        const presentRadio = row.querySelector(
            'input[type="radio"][value="present"]',
        );
        const reasonInput = row.querySelector(".reason-input");

        if (presentRadio) {
            presentRadio.checked = true;
            count++;
        }
        if (reasonInput) {
            reasonInput.style.display = "none";
            reasonInput.value = "";
        }
    });

    showNotification(`${count} visible cadets marked as present`, "success");
    updateAttendanceSummary();
}

function markAllAbsent() {
    const visibleRows = document.querySelectorAll(
        '#attendanceTableBody tr:not([style*="display: none"])',
    );
    let count = 0;

    visibleRows.forEach((row) => {
        const absentRadio = row.querySelector(
            'input[type="radio"][value="absent"]',
        );
        const reasonInput = row.querySelector(".reason-input");

        if (absentRadio) {
            absentRadio.checked = true;
            count++;
        }
        if (reasonInput) {
            reasonInput.style.display = "block";
        }
    });

    showNotification(
        `${count} visible cadets marked as absent. Please enter reasons.`,
        "info",
    );
    updateAttendanceSummary();
}

function saveAttendance() {
    const selectedDate = document.getElementById("attendanceDate").value;

    if (!selectedDate) {
        showNotification("Please select a date", "error");
        return;
    }

    const attendanceData = [];
    const rows = document.querySelectorAll("#attendanceTableBody tr");

    let hasErrors = false;

    rows.forEach((row) => {
        const cadetId = parseInt(row.getAttribute("data-cadet-id"));
        const cadet = cadets.find((c) => c.id === cadetId);

        const selectedRadio = row.querySelector('input[type="radio"]:checked');
        const reasonInput = row.querySelector(".reason-input");

        if (!selectedRadio) {
            showNotification(
                `Please select attendance status for ${cadet.name}`,
                "error",
            );
            hasErrors = true;
            return;
        }

        const status = selectedRadio.value;
        const reason = reasonInput.value.trim();

        // Validate that absent cadets have a reason
        if (status === "absent" && !reason) {
            showNotification(
                `Please enter a reason for ${cadet.name}'s absence`,
                "error",
            );
            reasonInput.focus();
            hasErrors = true;
            return;
        }

        attendanceData.push({
            cadetId: cadetId,
            cadetName: cadet.name,
            cadetRank: cadet.rank,
            status: status,
            reason: status === "absent" ? reason : null,
            timestamp: new Date().toISOString(),
        });
    });

    if (hasErrors) return;

    // Save to localStorage
    if (saveAttendanceData(selectedDate, attendanceData)) {
        showNotification(
            `Attendance saved successfully for ${formatDate(selectedDate)}`,
            "success",
        );

        // Show view attendance button
        const viewButton = document.getElementById("viewAttendance");
        if (viewButton) {
            viewButton.style.display = "inline-flex";
        }
    } else {
        showNotification("Error saving attendance data", "error");
    }
}

// View attendance functions
function displayAttendanceRecords(date) {
    const displayDateElement = document.getElementById("displayDate");
    const attendanceRecordsContainer =
        document.getElementById("attendanceRecords");
    const presentCountElement = document.getElementById("presentCount");
    const absentCountElement = document.getElementById("absentCount");
    const totalCountElement = document.getElementById("totalCount");

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
        if (presentCountElement) presentCountElement.textContent = "0";
        if (absentCountElement) absentCountElement.textContent = "0";
        if (totalCountElement) totalCountElement.textContent = "0";

        return;
    }

    // Calculate statistics
    const presentCount = attendanceData.filter(
        (record) => record.status === "present",
    ).length;
    const absentCount = attendanceData.filter(
        (record) => record.status === "absent",
    ).length;
    const totalCount = attendanceData.length;

    // Update summary cards
    if (presentCountElement) presentCountElement.textContent = presentCount;
    if (absentCountElement) absentCountElement.textContent = absentCount;
    if (totalCountElement) totalCountElement.textContent = totalCount;

    // Generate records grid with enhanced cadet information
    const recordsHTML = `
        <div class="records-grid">
            ${attendanceData
                .map((record) => {
                    const cadet = cadets.find((c) => c.id === record.cadetId);
                    return `
                    <div class="cadet-record ${record.status}">
                        <div class="record-header">
                            <div class="record-name">${record.cadetName}</div>
                            <span class="record-status ${record.status}">
                                <i class="fas fa-${record.status === "present" ? "check" : "times"}"></i>
                                ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                        </div>
                        <div class="record-details">
                            ${
                                cadet
                                    ? `
                                <span class="year-badge year-${cadet.year}">${cadet.year}${cadet.year === 1 ? "st" : cadet.year === 2 ? "nd" : "rd"} Year</span>
                            `
                                    : ""
                            }
                            <span class="record-rank">${record.cadetRank}</span>
                        </div>
                        ${
                            record.reason
                                ? `<div class="record-reason">
                            <i class="fas fa-comment"></i> ${record.reason}
                        </div>`
                                : ""
                        }
                    </div>
                `;
                })
                .join("")}
        </div>
    `;

    attendanceRecordsContainer.innerHTML = recordsHTML;
}

function downloadAttendanceCSV(date) {
    const attendanceData = getAttendanceData(date);

    if (!attendanceData || attendanceData.length === 0) {
        showNotification("No attendance data available for download", "error");
        return;
    }

    // Create CSV content
    const headers = ["Cadet Name", "Rank", "Status", "Reason", "Date"];
    const csvContent = [
        headers.join(","),
        ...attendanceData.map((record) =>
            [
                `"${record.cadetName}"`,
                `"${record.cadetRank}"`,
                record.status,
                `"${record.reason || ""}"`,
                date,
            ].join(","),
        ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `NCC_Attendance_${date}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification("Attendance data downloaded successfully", "success");
    } else {
        showNotification("Download not supported in this browser", "error");
    }
}

// URL parameter handling for edit functionality
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize page based on URL parameters
function initializePage() {
    const dateParam = getURLParameter("date");
    if (dateParam && document.getElementById("attendanceDate")) {
        document.getElementById("attendanceDate").value = dateParam;
        loadAttendanceForDate(dateParam);
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);

function getAttendanceHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("ncc_attendance_")) {
            const date = key.replace("ncc_attendance_", "");
            const data = getAttendanceData(date);
            if (data) {
                history.push({
                    date: date,
                    presentCount: data.filter((r) => r.status === "present")
                        .length,
                    absentCount: data.filter((r) => r.status === "absent")
                        .length,
                    totalCount: data.length,
                    data: data,
                });
            }
        }
    }
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Dashboard Analytics Functions
function loadDashboardData() {
    const history = getAttendanceHistory();

    if (history.length === 0) {
        showEmptyDashboard();
        return;
    }

    // Calculate overview statistics
    const totalDays = history.length;
    const totalPossibleAttendance = totalDays * cadets.length;
    const totalActualAttendance = history.reduce(
        (sum, day) => sum + day.presentCount,
        0,
    );
    const avgAttendance = Math.round(
        (totalActualAttendance / totalPossibleAttendance) * 100,
    );
    const perfectDays = history.filter(
        (day) => day.presentCount === day.totalCount,
    ).length;

    // Update overview cards
    document.getElementById("totalDays").textContent = totalDays;
    document.getElementById("avgAttendance").textContent = `${avgAttendance}%`;
    document.getElementById("perfectDays").textContent = perfectDays;

    // Calculate best performing year
    const yearStats = calculateBestYear(history);
    const bestYear = Object.entries(yearStats).sort(
        (a, b) => b[1].percentage - a[1].percentage,
    )[0];
    document.getElementById("mostActive").textContent = bestYear
        ? `${bestYear[0]}${bestYear[0] == 1 ? 'st' : bestYear[0] == 2 ? 'nd' : 'rd'} Year`
        : "-";

    // Load detailed sections
    loadYearStats(history);
    loadTopPerformers(history);
    loadRecentRecords(history.slice(0, 5));
    loadTrendChart(history);

    showNotification("Dashboard data loaded successfully", "success");
}

function calculateBestYear(history) {
    const stats = {};

    [1, 2, 3].forEach((year) => {
        const yearCadets = cadets.filter((c) => c.year === year);
        let totalPresent = 0;
        let totalPossible = 0;

        history.forEach((day) => {
            const yearAttendance = day.data.filter((record) => {
                const cadet = cadets.find((c) => c.id === record.cadetId);
                return cadet && cadet.year === year;
            });

            totalPresent += yearAttendance.filter(
                (r) => r.status === "present",
            ).length;
            totalPossible += yearCadets.length;
        });

        stats[year] = {
            totalCadets: yearCadets.length,
            percentage:
                totalPossible > 0
                    ? Math.round((totalPresent / totalPossible) * 100)
                    : 0,
            totalPresent,
            totalPossible,
        };
    });

    return stats;
}

function loadYearStats(history) {
    const yearStats = {};

    [1, 2, 3].forEach((year) => {
        const yearCadets = cadets.filter((c) => c.year === year);
        let totalPresent = 0;
        let totalPossible = 0;

        history.forEach((day) => {
            const yearAttendance = day.data.filter((record) => {
                const cadet = cadets.find((c) => c.id === record.cadetId);
                return cadet && cadet.year === year;
            });

            totalPresent += yearAttendance.filter(
                (r) => r.status === "present",
            ).length;
            totalPossible += yearCadets.length;
        });

        yearStats[year] = {
            count: yearCadets.length,
            percentage:
                totalPossible > 0
                    ? Math.round((totalPresent / totalPossible) * 100)
                    : 0,
        };
    });

    const yearStatsHTML = Object.entries(yearStats)
        .map(
            ([year, stats]) => `
        <div class="stat-item">
            <div class="stat-header">
                <span class="year-badge year-${year}">${year}${year == 1 ? "st" : year == 2 ? "nd" : "rd"} Year</span>
                <span class="stat-percentage">${stats.percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${stats.percentage}%"></div>
            </div>
            <div class="stat-detail">${stats.count} cadets</div>
        </div>
    `,
        )
        .join("");

    document.getElementById("yearStats").innerHTML = yearStatsHTML;
}

// Company stats function removed - no longer using company filtering

function loadTopPerformers(history) {
    const cadetPerformance = {};

    cadets.forEach((cadet) => {
        let present = 0;
        let total = 0;

        history.forEach((day) => {
            const record = day.data.find((r) => r.cadetId === cadet.id);
            if (record) {
                if (record.status === "present") present++;
                total++;
            }
        });

        cadetPerformance[cadet.id] = {
            cadet,
            percentage: total > 0 ? Math.round((present / total) * 100) : 0,
            present,
            total,
        };
    });

    const topPerformers = Object.values(cadetPerformance)
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

    const topPerformersHTML = topPerformers
        .map(
            (performer, index) => `
        <div class="performer-item">
            <div class="performer-rank">${index + 1}</div>
            <div class="performer-info">
                <div class="performer-name">${performer.cadet.name}</div>
                <div class="performer-details">
                    <span class="year-badge year-${performer.cadet.year}">${performer.cadet.year}${performer.cadet.year === 1 ? "st" : performer.cadet.year === 2 ? "nd" : "rd"}</span>
                </div>
            </div>
            <div class="performer-score">${performer.percentage}%</div>
        </div>
    `,
        )
        .join("");

    document.getElementById("topPerformers").innerHTML = topPerformersHTML;
}

function loadRecentRecords(recentHistory) {
    const recordsHTML = recentHistory
        .map(
            (record) => `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(record.date)}</div>
            <div class="timeline-stats">
                <span class="present-stat">${record.presentCount} Present</span>
                <span class="absent-stat">${record.absentCount} Absent</span>
                <span class="total-stat">${record.totalCount} Total</span>
            </div>
            <div class="timeline-percentage">
                ${Math.round((record.presentCount / record.totalCount) * 100)}% Attendance
            </div>
        </div>
    `,
        )
        .join("");

    document.getElementById("recordsTimeline").innerHTML = recordsHTML;
}

function loadTrendChart(history) {
    const chartData = history
        .slice(0, 10)
        .reverse()
        .map((day) => {
            const percentage = Math.round(
                (day.presentCount / day.totalCount) * 100,
            );
            return {
                date: new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                percentage,
            };
        });

    const chartHTML = `
        <div class="chart-container">
            ${chartData
                .map(
                    (point) => `
                <div class="chart-bar">
                    <div class="bar-fill" style="height: ${point.percentage}%"></div>
                    <div class="bar-label">${point.date}</div>
                    <div class="bar-value">${point.percentage}%</div>
                </div>
            `,
                )
                .join("")}
        </div>
    `;

    document.getElementById("trendChart").innerHTML = chartHTML;
}

function showEmptyDashboard() {
    document.getElementById("totalDays").textContent = "0";
    document.getElementById("avgAttendance").textContent = "0%";
    document.getElementById("perfectDays").textContent = "0";
    document.getElementById("mostActive").textContent = "-";

    const emptyMessage =
        '<div class="empty-dashboard">No attendance data available. Start by recording some attendance!</div>';
    document.getElementById("yearStats").innerHTML = emptyMessage;
    document.getElementById("topPerformers").innerHTML = emptyMessage;
    document.getElementById("recordsTimeline").innerHTML = emptyMessage;
    document.getElementById("trendChart").innerHTML = emptyMessage;
}

function resetDashboardData() {
    if (confirm('Are you sure you want to clear all NCC attendance data? This action cannot be undone.')) {
        // Clear all attendance data from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('ncc_attendance_')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Reload dashboard to show empty state
        loadDashboardData();
        
        showNotification('All NCC attendance data has been cleared', 'success');
    }
}

function exportAnalyticsReport() {
    const history = getAttendanceHistory();

    if (history.length === 0) {
        showNotification("No data available to export", "error");
        return;
    }

    // Create comprehensive CSV report
    const csvContent = [
        "Date,Total Cadets,Present,Absent,Attendance %",
        ...history.map((day) =>
            [
                day.date,
                day.totalCount,
                day.presentCount,
                day.absentCount,
                Math.round((day.presentCount / day.totalCount) * 100),
            ].join(","),
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `NCC_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification("Analytics report downloaded successfully", "success");
    }
}

// Export functions for global access
window.NCCAttendance = {
    loadAttendanceForDate,
    markAllPresent,
    markAllAbsent,
    saveAttendance,
    displayAttendanceRecords,
    downloadAttendanceCSV,
    showNotification,
    updateAttendanceSummary,
    clearAllAttendance,
    toggleSearch,
    filterCadets,
    navigateToDate,
    getAttendanceHistory,
};
