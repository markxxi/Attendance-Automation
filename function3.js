
function renderTable() {
    const employees = localStorage.getItem('jsonData');
    const tableBody = document.getElementById('recordsTable');
    tableBody.innerHTML = ''; // Clear the table before inserting new rows
    
    employees.forEach(employee => {
        // Create a row for each employee
        const row = document.createElement('tr');
        
        // Add the employee data (ID, Name, Department)
        const idCell = document.createElement('td');
        idCell.textContent = employee.id;
        row.appendChild(idCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = employee.name;
        row.appendChild(nameCell);
        
        const deptCell = document.createElement('td');
        deptCell.textContent = employee.department;
        row.appendChild(deptCell);

        // Add the records for each day (1-31)
        for (let day = 1; day <= 31; day++) {
            const recordCell = document.createElement('td');
            
            // If there are records for this day, show them, otherwise leave it empty
            const record = employee.records[day];
            recordCell.textContent = record && record.length > 0 ? record.join(', ') : '-';
            
            row.appendChild(recordCell);
        }

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Call the function to render the table when the page loads
//window.onload = renderTable;
const tablebody = document.getElementById('recordsTable');
tablebody.textContent = localStorage.getItem('jsonData');
console.log("test");

