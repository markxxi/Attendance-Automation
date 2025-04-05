
window.addEventListener("load", function () {
    setTimeout(() => { // Timeout for smooth transition
        let loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
            fileInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    // console.log('Selected file name testing:', file.name);
                    displayContainer();
                    previewExcelFile(file);
                }
            });
        }
    }, 800);
}); 

const uploadButton = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("previewExcelFile");
const reuploadButton = document.getElementById("changeFileBtn");
const submitButton = document.getElementById("submitFileBtn");
const hideFirstContainer = document.getElementById("hideFirstContainer");
const previewScreen = document.getElementById("previewScreen");

function displayContainer(){
hideFirstContainer.style.display = "none";
previewScreen.style.display = "block";
}

var json;

function previewExcelFile(file) {
const reader = new FileReader();
  reader.onload = function (e) {
  const data = e.target.result;
  const workbook = XLSX.read(data, {
      type: "binary",
  });

  const properties = workbook.Props; 

  // Print properties
  console.log("Excel File Properties:", properties);

  const sheetNames = workbook.SheetNames;
  // console.log('Sheet Names:', sheetNames);

  const firstSheet = workbook.Sheets[sheetNames[0]];

  json = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
  });

  //  console.log('JSON Output:', json);
  localStorage.setItem("rawJsondata", JSON.stringify(json));
  let monthYear = "";
  json.forEach((row, index) => {
      if (row[0]?.toString().startsWith("Month")) {
          monthYear = row.join(" ");
          var monthOfFile = monthYear;
          console.log(monthOfFile);
          localStorage.setItem("monthOfFile", monthYear);
      }
  });

  displayTable(json);
};

reader.readAsBinaryString(file);
}

function displayTable(data) {
console.log(data);
let tableHTML =
  "<table class='table table-bordered table-striped table-hover'>";

let currentUser = null;
let userDetails = "";
let maxColumns = 0;

data.forEach((row, index) => {
  maxColumns = Math.max(maxColumns, row.length);
  //localStorage.setItem('jsonMonth', row[0]?.toString().startsWith("Month"));
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
      row.forEach((cell) => {
          tableHTML += `<th>${cell || ""}</th>`;
      });
      tableHTML += "</tr>";
  } else if (row[0]?.toString().startsWith("Month")) {
      // Month
      tableHTML += "<tr>";
      row.forEach((cell) => {
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

function hideUploadButtonShowChangeFileButton() {
uploadButton.style.display = "none";
reuploadButton.style.display = "inline-block";
submitButton.style.display = "inline-block";
}

function submitFile() {
let users = [];
let currentUser = null;
let days = [];
let times = [];
let firstHalfStored = false; // tracker

//console.log("Raw JSON Data:", json);

json.forEach((row, rowIndex) => {
  //  console.log("Processing Row:", rowIndex, row); // debug point

  if (row[0]?.toString().startsWith("US")) {
      // Extract user details
      const userDetails = row
          .join(" ")
          .match(/ID:\s*(\d+)\s*Name:\s*([\w\s]+)\s*Dep\.\s*:\s*(\w+)/);
      //console.log("Extracted User Details:", userDetails); // debug point

      if (userDetails) {
          if (currentUser !== null) {
              if (days.length > 0) {
                  let newRecords = mapCKtoDD(days, times);
                  mergeRecords(currentUser.records, newRecords);
              }
              users.push(currentUser);
          }

          currentUser = {
              id: userDetails[1],
              name: userDetails[2].trim(),
              department: userDetails[3],
              records: {},
          };

          days = [];
          times = [];
          firstHalfStored = false;
      }
  } else if (row[0] === "DD") {
      if (currentUser !== null) {
          if (days.length > 0) {
              let newRecords = mapCKtoDD(days, times);
              mergeRecords(currentUser.records, newRecords);
              days = [];
              times = [];
          }
          days = row.slice(1);
          firstHalfStored = true;
          //console.log("Stored Days:", days); // debug point
      }
  } else if (row[0] === "CK") {
      if (currentUser !== null) {
          times.push(row.slice(1));
          //console.log("Captured CK Times:", times); // debug point
      }
  }
});

if (currentUser !== null && days.length > 0) {
  let finalRecords = mapCKtoDD(days, times);
  mergeRecords(currentUser.records, finalRecords);
  users.push(currentUser);
}
convertedToJsonObj = JSON.stringify(users, null, 2);
handleJsonString();
}

//important variable!!!
var convertedToJsonObj;
var jsonparse;
function getResult() {
jsonparse = JSON.parse(convertedToJsonObj);
for (var test of jsonparse) {
  //console.log(test.records[3][0]);
  // console.log(test);
}
}

function handleJsonString() {
try {
  localStorage.setItem("jsonData", convertedToJsonObj);

  if (validateTimeRecords()) {
      window.location.href = "result.html";
  }
  //console.log(convertedToJsonObj);
  //window.location.href="test3.html";
} catch (e) {
  console.log("Invalid format.");
}
}

function validateTimeRecords() {
const jsonData = JSON.parse(localStorage.getItem("jsonData"));
let errorRecords = {};

for (const employee of jsonData) {
  for (let day in employee.records) {
      const recordTimes = employee.records[day];
      const splitTimes = recordTimes[0] ? recordTimes[0].split(" ") : [];
      const splitTimes2 = splitTimes.filter(str => str !== "");
      if (splitTimes2.length !== 0 && splitTimes2.length !== 4) {
          if (!errorRecords[employee.name]) {
              errorRecords[employee.name] = [];
          }
          errorRecords[employee.name].push(
              `day ${day} (found ${splitTimes2.length})`,
          );
      }
  }
}

if (Object.keys(errorRecords).length > 0) {
  let errorMessages = Object.entries(errorRecords).map(
      ([name, days]) =>
          ` • Invalid record for ${name} on ${days.join(", ")}. Expected 4 time entries.`,
  );
  console.log(errorMessages.join("\n"));

  $("#errorMessage").html(errorMessages.join("<br><br>"));
  $("#errorModal").modal("show");

  return false;
}
return true;
}


function mergeRecords(existingRecords, newRecords) {
Object.keys(newRecords).forEach((day) => {
  if (!existingRecords[day]) {
      existingRecords[day] = [];
  }
  existingRecords[day] = existingRecords[day].concat(newRecords[day]);
});
}

function mapCKtoDD(days, times) {
let records = {};
days.forEach((day, index) => {
  if (!records[day]) records[day] = [];
  times.forEach((timeRow) => {
      if (timeRow[index]) {
          records[day].push(timeRow[index].trim());
      }
  });
});

//console.log("Mapped Records:", records); // debug point
return records;
}

function mapCKtoDD(days, times) {
let records = {};
days.forEach((day, index) => {
  if (!records[day]) records[day] = [];
  times.forEach((timeRow) => {
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

//-----------------------------

function tableresult() {
const tableBody = document.querySelector("#tableResult tbody");
for (i = 0; i < jsonparse.length; i++) {
  const row = jsonparse[i];
  const tr = document.createElement("tr");
  for (let key in row) {
      const td = document.createElement("td");
      td.textContent = row[key];
      tr.appendChild(td);
  }
  tableBody.appendChild(tr);
}
}

document.addEventListener("DOMContentLoaded", function () {
const fileInput = document.getElementById("fileInput");
const expandIcon = document.getElementById("expandIcon");
const fileModal = document.getElementById("fileModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");


if (!fileInput || !expandIcon || !fileModal || !modalBody) {
  console.error("Missing required elements in the DOM.");
  return;
}

// Function to preview file inside modal
expandIcon.addEventListener("click", function () {
  if (json) {
      modalBody.innerHTML = document.getElementById("previewExcelFile").innerHTML; // Copy preview to modal
      fileModal.style.display = "block";
  } else {
      alert("Please upload an Excel file first.");
  }
});

// Close the modal when clicking 'X'
closeModal.addEventListener("click", function () {
  fileModal.style.display = "none";
});


// Close the modal if user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === fileModal) {
      fileModal.style.display = "none";
  }
});
});