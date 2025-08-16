// view.js
const viewBtn = document.getElementById("load-btn");
const viewTable = document.querySelector("#view-table tbody");
const editBtn = document.getElementById("edit-btn");
const exportBtn = document.getElementById("export-btn");

viewBtn.onclick = () => {
  const date = document.getElementById("view-date").value;
  if (!date) return alert("Please select a date.");

  const data = JSON.parse(localStorage.getItem(`attendance-${date}`));
  viewTable.innerHTML = "";

  if (!data) return alert("No data for this date.");

  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td>${row.status}</td>
      <td>${row.status === "Absent" ? row.reason : "-"}</td>
    `;
    viewTable.appendChild(tr);
  });

  editBtn.onclick = () => {
    localStorage.setItem("edit-date", date);
    window.location.href = "index.html";
  };

  exportBtn.onclick = () => {
    let csv = "Cadet Name,Status,Reason\n";
    data.forEach(r => {
      csv += `${r.name},${r.status},${r.reason}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance-${date}.csv`;
    link.click();
  };
};

// Load date if editing
window.onload = () => {
  const editDate = localStorage.getItem("edit-date");
  if (editDate) {
    document.getElementById("attendance-date").value = editDate;
    const stored = JSON.parse(localStorage.getItem(`attendance-${editDate}`));
    if (stored) {
      tableBody.innerHTML = "";
      stored.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.name}</td>
          <td>
            <select class="status">
              <option value="Present" ${row.status === "Present" ? "selected" : ""}>Present</option>
              <option value="Absent" ${row.status === "Absent" ? "selected" : ""}>Absent</option>
            </select>
          </td>
          <td><input type="text" class="reason" value="${row.reason}" ${row.status === "Present" ? "disabled" : ""}></td>
        `;
        tableBody.appendChild(tr);
      });
    }
    localStorage.removeItem("edit-date");
  }
};
