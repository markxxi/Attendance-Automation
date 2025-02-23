
const uploadButton = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("previewExcelFile")
const reuploadButton = document.getElementById("changeFileBtn")
const submitButton = document.getElementById("submitFileBtn")

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log('Selected file name testing:', file.name);
        previewExcelFile(file)
    }
});
var json;
function previewExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const sheetNames = workbook.SheetNames;
        console.log('Sheet Names:', sheetNames);

        const firstSheet = workbook.Sheets[sheetNames[0]];

        json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        console.log('JSON Output:', json);
        displayTable(json);
    };

    reader.readAsBinaryString(file);
}

function displayTable(data) {
    let tableHTML = "<table class='table table-bordered table-striped table-hover'>";
    
    let currentUser = null;
    let userDetails = "";
    let maxColumns = 0; 

    data.forEach((row, index) => {
        maxColumns = Math.max(maxColumns, row.length);

        if (index === 0) {
            tableHTML += `<thead><tr><th colspan="100%">${row.join(" ")}</th></tr></thead><tbody>`;
        } else if (row[0]?.toString().startsWith("DHSUD")) {
            tableHTML += `<tr><td colspan="100%"><b>${row.join(" ")}</b></td></tr>`;
        } else if (row[0]?.toString().startsWith("Month")) {
            tableHTML += `<tr><td colspan="100%"><b>${row.join(" ")}</b></td></tr>`;
        } else if (row[0]?.toString().startsWith("US")) {
            if (currentUser) {
                tableHTML += "</tbody>";
            }
            currentUser = row.join(" ");
            userDetails = `<tr><th colspan="100%" style="text-align: left;">${currentUser}</th></tr>`;
            tableHTML += `<thead>${userDetails}</thead><tbody>`;
        } else if (row[0]?.toString().startsWith("ID")) {
            // ID
            tableHTML += "<tr>";
            row.forEach(cell => {
                tableHTML += `<th>${cell || ""}</th>`;  
            });
            tableHTML += "</tr>";
        } else if (row[0]?.toString().startsWith("Month")) {
            // Month
            tableHTML += "<tr>";
            row.forEach(cell => {
                tableHTML += `<td><b>${cell || ""}</b></td>`;  
            });
            tableHTML += "</tr>";
        } else if (row[0] === "DD") {
            tableHTML += "<tr><th>DD</th>";
            for (let i = 1; i < maxColumns; i++) {
                tableHTML += `<th>${row[i] || ""}</th>`;
            }
            tableHTML += "</tr>";
        } else if (row[0] === "CK") {
            tableHTML += "<tr><th>CK</th>";
            for (let i = 1; i < maxColumns; i++) {
                tableHTML += `<td>${row[i] || ""}</td>`;
            }
            tableHTML += "</tr>";
        } else {
            tableHTML += "<tr>";
            row.forEach((cell, idx) => {
                tableHTML += `<td>${cell || ""}</td>`; 
            });
            for (let i = row.length; i < maxColumns; i++) {
                tableHTML += `<td></td>`;
            }
            tableHTML += "</tr>";
        }
    });

    tableHTML += "</tbody></table>";
    filePreview.innerHTML = tableHTML;
    hideUploadButtonShowChangeFileButton();
}


function uploadFile() {
    fileInput.click();
}

function hideUploadButtonShowChangeFileButton(){
    uploadButton.style.display = "none";
    reuploadButton.style.display = "inline-block";
    submitButton.style.display = "inline-block";
}

function submitFile() {
    let users = [];
    let currentUser = null;
    let days = [];
    let times = [];
    let firstHalfStored = false; 

    json.forEach((row) => {
        if (row[0]?.toString().startsWith("US")) {
            const userDetails = row.join(" ").match(/ID:\s*(\d+)\s*Name:\s*([\w\s]+)\s*Dep\.\s*:\s*(\w+)/);
            if (userDetails) {
                if (currentUser) {
                    users.push(currentUser);
                }

                currentUser = {
                    id: userDetails[1],
                    name: userDetails[2].trim(),
                    department: userDetails[3],
                    records: {}
                };

                days = [];
                times = [];
                firstHalfStored = false;  
            }
        } else if (row[0] === "DD") {
            if (firstHalfStored) {
                let newRecords = mapCKtoDD(days, times);
                Object.keys(newRecords).forEach(day => {
                    if (!currentUser.records[day]) {
                        currentUser.records[day] = [];
                    }
                    currentUser.records[day] = currentUser.records[day].concat(newRecords[day]);
                });

                days = [];
                times = [];
            }
            days = row.slice(1);
            firstHalfStored = true;
        } else if (row[0] === "CK") {
            times.push(row.slice(1));
        }
    });

    if (currentUser) {
        let finalRecords = mapCKtoDD(days, times);
        Object.keys(finalRecords).forEach(day => {
            if (!currentUser.records[day]) {
                currentUser.records[day] = [];
            }
            currentUser.records[day] = currentUser.records[day].concat(finalRecords[day]);
        });

        users.push(currentUser);
    }

    console.log(JSON.stringify(users, null, 2));
}


function mapCKtoDD(days, times) {
    let records = {};
    
    days.forEach((day, index) => {
        if (!records[day]) records[day] = [];
        times.forEach(timeRow => {
            if (timeRow[index]) {
                records[day].push(timeRow[index].trim()); 
            }
        });
    });

    return records;
}


uploadButton.addEventListener("click", uploadFile);
reuploadButton.addEventListener("click", uploadFile);
submitButton.addEventListener("click", submitFile);
