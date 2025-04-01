window.addEventListener("load", function () {
    setTimeout(() => { // Timeout for smooth transition
        let loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = "none";

            displayJsonDataToTable();
        }
    }, 800);
}); 



var selectedDate;
//find the lowest date with data of days in the month 
function findLowestNumber(numbers) {
  numbers = numbers.filter((num) => num !== null); // Remove null values
  if (numbers.length === 0) return null; // Return null if the array is empty

  let lowest = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] < lowest) {
          lowest = numbers[i];
      }
  }
  return lowest;
}
//find first date with data
function firstNonEmptyKey(data) {
  return data
      .map((entry) => {
          const firstNonEmptyKey = Object.keys(entry.records).find(
              (key) => entry.records[key].length > 0,
          );
        
          return firstNonEmptyKey !== undefined
              ? parseInt(firstNonEmptyKey)
              : null;
      })
      .filter((value) => value !== null);
}
//which start date should it display a data 
document.getElementById("startDate").addEventListener("change", function (event) {
  selectedDate = event.target.value;
  console.log(selectedDate);
  //console.log(selectedDate);
  //updateTable(selectedDate);
  let lastCharDate = selectedDate.slice(-2);
  //console.log(lastCharDate);
  if (lastCharDate[0] == "0") {
      lastCharDate = lastCharDate.replace("0", ""); // Remove '0'
      selectedDate = lastCharDate;
  } else {
      selectedDate = lastCharDate;
  }
  selectedDate = lastCharDate;
  updateTable(selectedDate);
 // console.log(selectedDate);
 
 
});

//table view and excel view
document.querySelectorAll(".btn-group .btn").forEach((button) => {
  button.addEventListener("click", function () {
      document
          .querySelectorAll(".btn-group .btn")
          .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
  });
});

var jsonObject;
//display the acquired data to table
var key, detailsCell, tableBody;
function updateTable(date) {
  showSearchFilter();
  tableBody = document.querySelector("#tableResult tbody");
  tableBody.innerHTML = ""; // Clear previous rows

  for(key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
          var row = tableBody.insertRow();
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          var cell6 = row.insertCell(5);
          var cell7 = row.insertCell(6);
          var cell8 = row.insertCell(7);
          var cell9 = row.insertCell(8);
          var cell10 = row.insertCell(9);

          cell10.innerHTML = `<button class="btn custom-arrow"><i class="bi bi-chevron-right"></i></button>`;

          cell1.textContent = jsonObject[key].id;

          cell2.textContent = jsonObject[key].name;
          cell3.textContent = jsonObject[key].department;

          splitTime(key, cell4, 0, date, date);
          splitTime(key, cell5, 3, date, date);

          calculateTimeDifference(key, cell8, cell5, date);

          overtime(key, cell6, cell9, cell7);

          var detailsRow = tableBody.insertRow();
          detailsRow.classList.add("collapsible-content", "d-none");
          detailsCell = detailsRow.insertCell(0);
          detailsCell.colSpan = 10;

          fetchDetailsContent(detailsCell, jsonObject[key].id);

      }
 } //getMonth();
}

//the arrow function to inflate collapsible
function displayJsonDataToTable() {
  var jsonData = localStorage.getItem("jsonData");
  if (jsonData) {
      jsonObject = JSON.parse(jsonData);
      selectedDate = findLowestNumber(firstNonEmptyKey(jsonObject));
      getMonth();
      updateTable(selectedDate);
      
  }
  document.querySelector("#tableResult tbody").addEventListener("click", function (e) {
      if (e.target.closest(".custom-arrow")) {
          const collBt = e.target.closest(".custom-arrow");
          const row = collBt.closest("tr");
          const detailsRow = row.nextElementSibling;

          if (detailsRow && detailsRow.classList.contains("collapsible-content")) {
              detailsRow.classList.toggle("d-none");

              // Toggle the icon inside the button
              const icon = collBt.querySelector("i");
              if (icon) {
                  icon.classList.toggle("bi-chevron-right");
                  icon.classList.toggle("bi-chevron-down");
              }
          }
      }
  });
}

//fetch the html file that will appear in the collapsible
function fetchDetailsContent(detailsCell, selectedID) {
  fetch("collapsible.html")
      .then((response) => response.text())
      .then((data) => {
          detailsCell.innerHTML = `<div class="table-responsive p-2">${data}</div>`;

          let excelViewElements = detailsCell.querySelectorAll("#excelView");
          excelViewElements.forEach((element) => {
              let mergedEmployeeData = ExcelViewForCollapsible(element, selectedID);
              let hoursRenderedField = detailsCell.querySelectorAll(".totaltime"); 
              let OTRenderedField = detailsCell.querySelectorAll(".totalot"); 
              let UTRenderedField = detailsCell.querySelectorAll(".totalut"); 
              let LateRenderedField = detailsCell.querySelectorAll(".totallate");
              let employeeKeys = Object.keys(mergedEmployeeData); // Get all employee IDs
              

              hoursRenderedField.forEach((field, index) => {
                  let employeeData = mergedEmployeeData[employeeKeys[index]]; 

                  if (employeeData) {
                      field.textContent = employeeData.totalRenderedTime;
                  } else {
                      field.textContent = "No Data";
                  }
              });
                  OTRenderedField.forEach((field, index) => {
                  let employeeData = mergedEmployeeData[employeeKeys[index]]; 

                  if (employeeData) {
                      field.textContent = employeeData.overtimeRenderedTime;
                  } else {
                      field.textContent = "No Data";
                  }
              });
                  UTRenderedField.forEach((field, index) => {
                  let employeeData = mergedEmployeeData[employeeKeys[index]];

                  if (employeeData) {
                      field.textContent = employeeData.undertimeRenderedTime;
                  } else {
                      field.textContent = "No Data";
                  }
              });
                  LateRenderedField.forEach((field, index) => {
                  let employeeData = mergedEmployeeData[employeeKeys[index]];

                  if (employeeData) {
                      field.textContent = employeeData.lateTotal;
                  } else {
                      field.textContent = "No Data";
                  }
              });
             //console.log(mergedEmployeeData);
              
          });
      })
      .catch((error) => {
          console.error("Error fetching test4.html:", error);
          detailsCell.innerHTML = `<div class="table-responsive text-danger">Error loading details.</div>`;
      });
}

//the excel table inside the collapsible
function ExcelViewForCollapsible(excelView, selectedUSID) {
  let file = localStorage.getItem("rawJsondata");
  if (!file) {
      console.warn("No data found in localStorage.");
      return;
  }

  let jsonData = JSON.parse(file);
  let tableHTML =
      "<table class='table'>";
  let currentUser = null;
  let maxColumns = 0;
  let isMatchingUSID = false;
  let foundData = false; //
  let mergedEmployeeData = {}; 
  
  var ckRows = [];
  var ddRows = [];
  //console.log("Selected US ID:", selectedUSID); // Debugging

  jsonData.forEach((row) => {
      maxColumns = Math.max(maxColumns, row.length);

      if (row[0]?.toString().startsWith("US")) {
          let rowUSID = row.join(" "); // 
          var splits = rowUSID.split("  ");
          var splitsGet0 = splits[0];
          var regex = splitsGet0.match(/\d+/g);
          isMatchingUSID = parseInt(regex ? regex.join("") : "0", 10) === parseInt(selectedUSID, 10);
      }

      if (isMatchingUSID) {
          foundData = true; 

          if (row[0]?.toString().startsWith("US")) {
              if (currentUser) {
                  tableHTML += "</tbody>";
              }
              currentUser = row.join(" ");
              //userDetails = `<tr><th colspan="100%" style="text-align: left;">${currentUser}</th></tr>`;
              // tableHTML += `<thead>${userDetails}</thead><tbody>`;
          } else if (row[0] === "DD") {
              tableHTML += "<tr><th>DD</th>";
              for (let i = 1; i < maxColumns; i++) {
                  tableHTML += `<th>${row[i] || ""}</th>`;
              }
              //for computation
              let values = row.slice(1).map(value => value === null ? "-" : value); 
              ddRows.push(values);
              tableHTML += "</tr>";
          } else if (row[0] === "CK") {
              tableHTML += "<tr class='ck-row' style='display: table-row'><th>CK</th>";
              let timeResults = [];
              var timeio = [];
              var calculatedtimeio = [];
              var timein = [];

              for (let i = 1; i < row.length; i++) {
                  if (row[i] && typeof row[i] === "string") {
                      timeResults.push(row[i]);
                  } else {
                      timeResults.push("");
                  }
              }
              let timeDayMap = {};
              const latestDDRow = ddRows[ddRows.length - 1];
              timeResults.forEach((timeString, index) => {
                  if (timeString === undefined) {
                      timeString = " ";
                  }
                  const times = timeString.split(" ");
                  const splitTimes =
                      times.length >= 4 ? times[0] + " " + times[3] : timeString;

                  timeio.push(splitTimes);
                  calculatedtimeio.push(calc2(times[0], times[3]));
                  
                //  timein.push(times[0]);
                  const day = latestDDRow[index]; 
                  timeDayMap[day] = times[0];
                  timein.push(day + ": " + times[0]);
              });
               const mapString = Object.entries(timeDayMap)
                   .map(([day, time]) => `${day}: (${time})`)
                   .join(", ");
              
              //console.log("Mapped Timeins by Day:", timein);
              //console.log(calculateLateRenderedTime(timein)); 
              for (var employeekey in jsonObject) {
                  if (jsonObject.hasOwnProperty(employeekey)) {
                      if (!mergedEmployeeData[employeekey]) {
                          mergedEmployeeData[employeekey] = {
                              name: jsonObject[employeekey].name,         
                              department: jsonObject[employeekey].department, // use the employee's department
                              renderedTimes: [],
                              firstTimeIn: []
                          };
                      }
                    
                      mergedEmployeeData[employeekey].renderedTimes.push(...calculatedtimeio);
                      mergedEmployeeData[employeekey].firstTimeIn.push(...timein);
                      //console.log();
                  }
              }
              
              for (let i = 1; i < maxColumns; i++) {
                  tableHTML += `<td class="td-clp">${calculatedtimeio[i - 1] !== undefined ? calculatedtimeio[i - 1] : ""} </td>`;
              }    

              tableHTML += "</tr>";
              
          }
          else {

              tableHTML += "<tr>";
              row.forEach((cell, idx) => {
                  tableHTML += `<td>${cell || ""}</td>`;
              });
              for (let i = row.length; i < maxColumns; i++) {
                  tableHTML += `<td></td>`;
              }
              tableHTML += "</tr>";
          } 
      
      }
      
  });

  Object.keys(mergedEmployeeData).forEach(empID => {
      let employee = mergedEmployeeData[empID];
      employee.totalRenderedTime = calculateTotalRenderedTime(mergedEmployeeData[empID].renderedTimes);
      employee.overtimeRenderedTime = calculateOvertimeRenderedTime(employee.renderedTimes);
      employee.undertimeRenderedTime = calculateUndertimeRenderedTime(employee.renderedTimes);
     employee.lateTotal = calculateLateRenderedTime(employee.firstTimeIn);
     //console.log(employee.lateTotal);
  });

  if (!foundData) {
      console.warn("No matching data found for US ID:", selectedUSID);
      tableHTML += `<tr><td colspan="${maxColumns}" class="text-center text-danger">No data found for ${selectedUSID}</td></tr>`;
  }

  tableHTML += "</tbody></table>";
  excelView.innerHTML = tableHTML;
  //console.log(extractAndLogDayValues(ddRows, ckRows));
  return mergedEmployeeData;
}
let dayData = [];
let storedAllPairs;

// function extractAndLogDayValues(jsonData) {
//     const cal = document.getElementById("startDate");
  
//     let ddRows = [];
//     let ckRows = [];

//     jsonData.forEach((row) => {
//         if (row[0] === "DD") {
//             let values = row.slice(1).map(value => value === null ? "-" : value); 
//             ddRows.push(values);
//         } else if (row[0] === "CK") {
//             let values = row.slice(1).map(value => value === null ? "-" : value);
//             ckRows.push(values);
//         }
//     });

//     while (ckRows.length < ddRows.length) {
//         ckRows.push(new Array(ddRows[0].length).fill("-")); 
//     }

//     var datevalue = cal.value.toString();
//     let [year1, month1] = datevalue.split("-").map(Number);

//     var mondays = getMondays(year1, month1).map(String); 

//     let matchedMondays = {}; 

//     ddRows.forEach((ddRow, rowIndex) => {
//         let ckRow = ckRows[rowIndex] || new Array(ddRow.length).fill("-");

//         ddRow.forEach((num, colIndex) => {
//             let numValue = String(num);
//                 let ckValue = ckRow[colIndex] !== undefined ? ckRow[colIndex] : "-";
//                 let ckvalue1 = typeof ckValue === "string" ? ckValue.split(" ") : [ckValue];
//                 dayData.push({ index: colIndex + 1, num, ckValue: ckvalue1[0] }); 
//         });
//        // console.log(ddRow);
//     });
//     let matchingCkValues = dayData
//         .filter(item => mondays.includes(String(item.num)))
//         .map(item => ({
//             num: item.num,
//             ckValue: item.ckValue
//         }));

//     console.log(matchingCkValues);
//     console.log(dayData);
//     return dayData;
// }


function extractAndLogDayValues(ddRows, ckRows) {
  const cal = document.getElementById("startDate");
  let datevalue = cal.value.toString();
  let [year1, month1] = datevalue.split("-").map(Number);
  let mondays = getMondays(year1, month1).map(String); 

  dayData = []; 
  
  ddRows.forEach((row, rowIndex) => {
     let ckRow = ckRows[rowIndex] || new Array(row.length).fill("");

      row.forEach((num, colIndex) => {
          let numValue = String(num);
          let ckValue = ckRows[colIndex] !== undefined ? ckRows[colIndex] : "";

          //let ckValueClean = typeof ckValue === "string" ? ckValue[0] : ckValue;
          //console.log(ckValue);
          dayData.push({
              index: colIndex + 1,
              num: numValue,
              ckValue: ckValue
          });
      });
  });
      
  storedAllPairs = dayData.map(item => ({
      num: item.num,
      ckValue: item.ckValue
  }));
  
  // let matchingCkValues = dayData
  //     .filter(item => mondays.includes(item.num))
  //     .map(item => ({
  //         num: item.num,
  //         ckValue: item.ckValue
  //     }));

  //console.log(storedAllPairs);
  return storedAllPairs;
}

//calculation of overall renderend time inside the collapsible
function calculateTotalRenderedTime(calculatedTimeIO) {
  let totalMinutes = 0;

  calculatedTimeIO.forEach(time => {
      if (time) { 
          let match = time.match(/(\d+) HR (\d+) MIN/);
          if (match) {
              let hours = parseInt(match[1]);
              let minutes = parseInt(match[2]);
              totalMinutes += hours * 60 + minutes;
          }
      }
  });

  let totalHours = Math.floor(totalMinutes / 60);
  let remainingMinutes = totalMinutes % 60;

  return `${totalHours} HR ${remainingMinutes} MIN`;
}

function calculateOvertimeRenderedTime(calculatedTimeIO) {
  let totalOvertimeMinutes = 0;
  let regularWorkMinutes = 8 * 60; // 8 hours in minutes

  calculatedTimeIO.forEach(time => {
      if (time) {
          let match = time.match(/(\d+) HR (\d+) MIN/);
          if (match) {
              let hours = parseInt(match[1]);
              let minutes = parseInt(match[2]);
              let totalMinutes = hours * 60 + minutes;

              if (totalMinutes > regularWorkMinutes) {
                  totalOvertimeMinutes += (totalMinutes - regularWorkMinutes);
              }
          }
      }
  });

  let overtimeHours = Math.floor(totalOvertimeMinutes / 60);
  let overtimeMinutes = totalOvertimeMinutes % 60;

  return `${overtimeHours} HR ${overtimeMinutes} MIN`;
}

function calculateUndertimeRenderedTime(calculatedTimeIO) {
  let totalUndertimeMinutes = 0;
  let regularWorkMinutes = 8 * 60; // 8 hours in minutes

  calculatedTimeIO.forEach(time => {
      if (time) {
          let match = time.match(/(\d+) HR (\d+) MIN/);
          if (match) {
              let hours = parseInt(match[1]);
              let minutes = parseInt(match[2]);
              let totalMinutes = hours * 60 + minutes;

              if (totalMinutes < regularWorkMinutes) {
                  totalUndertimeMinutes += (regularWorkMinutes - totalMinutes);
              }
          }
      }
  });

  let undertimeHours = Math.floor(totalUndertimeMinutes / 60);
  let undertimeMinutes = totalUndertimeMinutes % 60;

  return `${undertimeHours} HR ${undertimeMinutes} MIN`;
}

function calculateLateRenderedTime(firstTime) {
  const cal = document.getElementById("startDate");
  let datevalue = cal.value.toString();
  let [year1, month1] = datevalue.split("-").map(Number);
  let mondays = getMondays(year1, month1).map(String); 
  //console.log(cal);
  const thresholdMinutes = 9 * 60; 
  let totalLateMinutes = 0;

  firstTime.forEach(entry => {
      let dayMatch = entry.match(/^\d+/);
      let timeMatch = entry.match(/\b\d{1,2}:\d{2}\b/); 
      
      if (timeMatch) {
          let [hours, minutes] = timeMatch[0].split(":").map(Number);
          let totalMinutes = hours * 60 + minutes;

        
          let thresholdMinutes = mondays.includes(dayMatch?.[0]) ? 8 * 60 : 9 * 60;

          if (totalMinutes > thresholdMinutes) {
              totalLateMinutes += totalMinutes - thresholdMinutes;
          }
      }
  });

  return totalLateMinutes;
}

var timeRecordForDate;
var getFirstTimeIndex;
/*
function splitTime(key, cell4, index) {
  //array records[3] is related to calendar: change
  const cal = document.getElementById("startDate");
  let datevalue = cal.value.toString();
  let [year1, month1, day1] = datevalue.split("-").map(Number);
  let mondays = getMondays(year1, month1).map(String); 

  timeRecordForDate =
      jsonObject[key].records && jsonObject[key].records[3]
          ? jsonObject[key].records[selectedDate][0]
          : undefined;
        // console.log(timeRecordForDate, selectedDate);
  if (typeof timeRecordForDate === "undefined") {
      cell4.textContent = "-";
  } else {
      var timeToString = timeRecordForDate.toString();
    //  console.log(timeToString);
      var splitString = timeToString.split(" ");
      getFirstTimeIndex = splitString[index];

      getFirstTimeIndexLate = splitString[0];
      let timeMatch = getFirstTimeIndexLate.match(/\b\d{1,2}:\d{2}\b/); 
      if (timeMatch) {
          let [hours, minutes] = timeMatch[0].split(":").map(Number);
          let totalMinutes = hours * 60 + minutes;

          // Check if selected day is a Monday and adjust threshold
          let thresholdMinutes = mondays.includes(day1.toString()) ? 8 * 60 : 9 * 60;

          if (totalMinutes > thresholdMinutes) {
              let lateMinutes = totalMinutes - thresholdMinutes;
              console.log(`Late by ${lateMinutes} minutes`);
          }
      }

      cell4.textContent = getFirstTimeIndex;
  }
} */

  let totalLateMinutes = 0; // Global variable to store total late minutes

function splitTime(key, cell4, index, selecteddate) {
  const cal = document.getElementById("startDate");
  let datevalue = cal.value.toString();
  let [year1, month1, day1] = datevalue.split("-").map(Number);
  let mondays = getMondays(year1, month1).map(String); 

  timeRecordForDate =
      jsonObject[key].records && jsonObject[key].records[3]
          ? jsonObject[key].records[selecteddate][0]
          : undefined;

  if (typeof timeRecordForDate === "undefined") {
      cell4.textContent = "-";
  } else {
      var timeToString = timeRecordForDate.toString();
      var splitString = timeToString.split(" ");
      getFirstTimeIndex = splitString[index];

      getFirstTimeIndexLate = splitString[0]; // Extract first time (clock-in)
      let timeMatch = getFirstTimeIndexLate.match(/\b\d{1,2}:\d{2}\b/); 
      if (timeMatch) {
          let [hours, minutes] = timeMatch[0].split(":").map(Number);
          let totalMinutes = hours * 60 + minutes;

          // Check if selected day is a Monday and adjust threshold
          let thresholdMinutes = mondays.includes(day1.toString()) ? 8 * 60 : 9 * 60;

          if (totalMinutes > thresholdMinutes) {
              let lateMinutes = totalMinutes - thresholdMinutes;
              totalLateMinutes = lateMinutes; // Store late minutes globally
              console.log(`Late by ${lateMinutes} minutes`);
          } else {
              totalLateMinutes = 0; // Reset if not late
          }
      }

      cell4.textContent = getFirstTimeIndex;
  }
}


function calculateTimeDifference(key, cell8, cell5) {
  // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

  if (typeof timeRecordForDate === "undefined") {
      cell8.textContent = "-";
  } else {
      var timeToString = timeRecordForDate.toString();
      var splitString = timeToString.split(" ");
      
      var getFirstTime = splitString[0];
      var getLastTime = splitString[3];
      var [hours, minutes] = getFirstTime.split(":").map(Number);
      //console.log(hours);
      var [hoursLast, minutesLast] = getLastTime.split(":").map(Number);
      if (hours < 7) {
          getFirstTime = "07:00";
          
      } else if (hoursLast > 18 || (hoursLast === 18 && minutesLast > 0) ) {
          getLastTime = "18:00";
      }
      
      //console.log(getLastTime);
      calc(getFirstTime, getLastTime, cell8, cell5);
  }
}

var totalRenderedTime, hours, minutes;
/*
function calc(start, end, cell8, cell5) {
  if (start && end) {
      start = start.split(":");
      end = end.split(":");

      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();
     // console.log(startDate);
      if (diff < 0) {
          cell8.textContent = "Invalid time range";
          return;
      }

      hours = Math.floor(diff / 1000 / 60 / 60);
      hours1 = hours - 1;
      diff -= hours * 1000 * 60 * 60;

      minutes = Math.floor(diff / 1000 / 60);

      totalRenderedTime =
          (hours <= 9 ? "" : "") +
          hours1 +
          " HR " +
          (minutes <= 9 ? "" : "") +
          minutes +
          " MIN ";
      //console.log(totalRenderedTime);
      cell8.textContent = totalRenderedTime;
  } else {
      cell8.textContent = "No time data";
      cell5.textContent = "No time data";
  }
} */

  function calc(start, end, cell8, cell5) {
      if (start && end) {
          start = start.split(":");
          end = end.split(":");
  
          var startDate = new Date(0, 0, 0, start[0], start[1], 0);
          var endDate = new Date(0, 0, 0, end[0], end[1], 0);
          var diff = endDate.getTime() - startDate.getTime();
  
          if (diff < 0) {
              cell8.textContent = "Invalid time range";
              return;
          }
  
          let totalMinutesWorked = diff / 1000 / 60; // Convert total milliseconds to minutes
          let adjustedMinutes = totalMinutesWorked - totalLateMinutes; // Subtract late minutes
  
          if (adjustedMinutes < 0) {
              adjustedMinutes = 0; // Prevent negative total time
          }
  
          hours = Math.floor(adjustedMinutes / 60);
          minutes = adjustedMinutes % 60;
  
          totalRenderedTime = `${hours-1} HR ${minutes} MIN`;
          
          cell8.textContent = totalRenderedTime;
      } else {
          cell8.textContent = "No time data";
          cell5.textContent = "No time data";
      }
  }
  

function overtime(key, cell6, cell9, cell7) {
  if (typeof timeRecordForDate === "undefined") {
      cell6.textContent = "-";
      cell7.textContent = "-";
      cell9.textContent = "-";
      return;
  }

  if (hours !== undefined && minutes !== undefined) {
      if (hours > 8) {
          var overtimeHours = hours - 9;
          var totalOvertime = "";

          if (overtimeHours > 0) {
              totalOvertime += overtimeHours + " HR ";
          }

          totalOvertime += minutes + " MIN";
          cell6.textContent = totalOvertime;
          cell7.textContent = "-";

          var ot = hourValues(overtimeHours) || 0.0;
          var finalConversion = (ot + minuteValues(minutes)).toFixed(3);

          cell9.textContent = finalConversion;
      } else {
          cell6.textContent = "-";
          undertime(key, cell7, cell9);
      }
  } else {
      cell6.textContent = "Invalid time data";
  }
}

function undertime(key, cell7, cell9) {
  if (hours !== undefined && minutes !== undefined) {
      if (hours <= 8) {
          var undertimeHours = 8 - hours;
          var undertimeMinutes = 60 - minutes;
          var undertime = undertimeHours + " HR " + undertimeMinutes + " MIN";

          var ut = hourValues(undertimeHours) || 0.0;
          var finalConversion = (ut + minuteValues(undertimeMinutes)).toFixed(
              3,
          );

          cell7.textContent = undertime;

          cell9.textContent = finalConversion;
      } else {
          cell7.textContent = "-";
      }
  } else {
      cell7.textContent = "Invalid time data";
  }
}

function minuteValues(m) {
  let minutes = []; //1-60
  let equivMins = []; //decimal for mins
  let valuesForMins = {};

  if (m === 0) {
      return 0;
  }

  for (let i = 0.002; i <= 0.125; i += 0.002) {
      let roundedI = Math.round(i * 1000) / 1000; // Round to 3 decimal places

      if (roundedI === 0.012) {
          i = 0.013;
      }

      if (roundedI === 0.037) {
          i = 0.038;
      }
      if (roundedI === 0.062) {
          i = 0.063;
      }
      if (roundedI === 0.087) {
          i = 0.088;
      }
      if (roundedI === 0.112) {
          i = 0.113;
      }
      equivMins.push(roundedI);
  }

  for (let i = 1; i <= equivMins.length; i++) {
      minutes.push(i);
  }

  for (let i = 0; i <= equivMins.length; i++) {
      valuesForMins[minutes[i]] = equivMins[i];
  }
  //console.log();
  return valuesForMins[m];
  //hourValues();
}

function hourValues(h) {
  let hours = [1, 2, 3, 4, 5, 6, 7, 8]; //1-8
  let equivHours = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0]; //decimal for hours
  let valuesForHours = {};

  for (let i = 0; i <= equivHours.length; i++) {
      valuesForHours[hours[i]] = equivHours[i];
  }
  return valuesForHours[h];
}

function getMonth() {
  const cal = document.getElementById("startDate");
  const getMonth = localStorage.getItem("monthOfFile");
  //const getMonth = "Month : Mar 05 2024";
  //console.log(getMonth);
  var months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
  ];

  const monthMap = {
      jan: "january", feb: "february", mar: "march", apr: "april", may: "may", jun: "june",
      jul: "july", aug: "august", sep: "september", oct: "october", nov: "november", dec: "december"
  };

  const regex1 = /Month\s*:\s*(\w+)\s*(\d{4})/;
  const regex2 = /\s*:\s*(\d{2})/;
  const regex3 =  /Month\s*:\s*(\w{3})\s*(\d{2})\s*(\d{4})/i;
  let match;

  if (regex1.test(getMonth)) {
      match = getMonth.match(regex1);
      let monthLC = match[1].toLowerCase();
      //let test = "february";
      let monthIndex = months.indexOf(monthLC);
      const date = new Date(match[2], monthIndex, selectedDate + 1);
      const formattedDate = date.toISOString().split("T")[0];
      cal.value = formattedDate;
      console.log(formattedDate);
  } else if (regex2.test(getMonth)) {
      match = getMonth.match(regex2);
      let monthNumber = parseInt(match[1], 10);
      //let monthName = months[monthNumber-1];
      const year = new Date();
      const getYear = year.getFullYear();
      const date = new Date(getYear, monthNumber - 1, selectedDate + 1);
      const formattedDate = date.toISOString().split("T")[0];
      cal.value = formattedDate;
      // console.log("Extracted:", formattedDate); // Output: "02"
  } else if (regex3.test(getMonth)) {
      match = getMonth.match(regex3);
      let shortMonth = match[1].toLowerCase();
      let mapMonth = monthMap[shortMonth];
      let monthIndex = months.indexOf(mapMonth);
      const date = new Date(match[3], monthIndex, selectedDate + 1);
      const formattedDate = date.toISOString().split("T")[0];
      cal.value = formattedDate;
     // console.log(match[3], mapMonth, shortMonth, date);
  }
  else {
      //console.log(regex3.test(getMonth));
      console.log("No match found");
  }
  
}

function getMondays(year, month) {
  let date = new Date(year, month - 1, 1); // Month is zero-based in JS Date
  let mondays = [];

  while (date.getMonth() === month - 1) {
      if (date.getDay() === 1) { // 1 represents Monday
          mondays.push(`${date.getDate()}`);
      }
      date.setDate(date.getDate() + 1); // Move to the next day
  }

  return mondays;
}




function ExcelView() {
  const excelView = document.getElementById("tabView");
  const tableView = document.getElementById("tableView");
 
  excelView.addEventListener("click", function () {
      hideSearchFilter();
      tableView.classList.remove("btn-table");
      excelView.classList.remove("btn-default");
      tableView.classList.add("btn-default");
      excelView.classList.add("btn-table");
      

      fetch("test2.html")
          .then((response) => response.text())
          .then((data) => {
              document.getElementById("displayBox").innerHTML = data;
              let file = localStorage.getItem("rawJsondata");
              if (file) {
                  let jsonData = JSON.parse(file);
                  displayTable(jsonData);
              }
          })
          .catch((error) => {
              console.error("Error loading the file:", error);
          });
  });
}

ExcelView();

  const excelView = document.getElementById("tabView");
  const tableView = document.getElementById("tableView");
  tableView.addEventListener("click", function () {
      // window.location.href = "result.html";

      tableView.classList.remove("btn-default");
      tableView.classList.add("btn-table");
      excelView.classList.remove("btn-table");
      excelView.classList.add("btn-default");
      showSearchFilter();
      fetch("TableView.html")
      .then ((response) => response.text())
      .then ((data)=>{
          document.getElementById("displayBox").innerHTML = data;
          displayJsonDataToTable();
      });
    
  });


function displayTable(data) {
  //console.log(data);
  let tableHTML =
      "<table class='table table-bordered table-striped table-hover'>";
  let excelView = document.getElementById("excelView");
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
      } else if (row[0]?.toString == null) {
          tableHTML += `<tr><td colspan="100%"></td></tr>`;
      } 
      else if (row[0]?.toString().startsWith("US")) {
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
          let timeResults = [];
          var timeio = [];
          var calculatedtimeio = [];
          for (let i = 1; i < row.length; i++) {
              if (row[i] && typeof row[i] === "string") {
                  timeResults.push(row[i]);
              } else {
                  timeResults.push("");
              }
          }
          timeResults.forEach((timeString, index) => {
              if (timeString === undefined) {
                  timeString = " ";
              }
              const times = timeString.split(" ");
              const splitTimes =
                  times.length >= 4 ? times[0] + "<br>" + times[3] : timeString;

              // console.log(calc2("08:16","18:40"));
              timeio.push(splitTimes);
              calculatedtimeio.push(calc2(times[0], times[3]));
          });
          //console.log(timeio);
          for (let i = 1; i < maxColumns; i++) {
              tableHTML += `<td>${timeio[i - 1] && timeio[i - 1].trim() ? timeio[i - 1] + "<hr>" : ""}${calculatedtimeio[i - 1] !== undefined ? calculatedtimeio[i - 1] : ""} </td>`;
              //${calculatedtimeio[i-1]}
              // console.log(calculatedtimeio[i-1]);
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
  excelView.innerHTML = tableHTML;
}

function calc2(start, end) {
  if (start && end) {
      start = start.split(":");
      end = end.split(":");

      var startDate = new Date(0, 0, 0, start[0], start[1], 0);
      var endDate = new Date(0, 0, 0, end[0], end[1], 0);
      var diff = endDate.getTime() - startDate.getTime();

      hours = Math.floor(diff / 1000 / 60 / 60);
      hours1 = hours - 1;
      diff -= hours * 1000 * 60 * 60;

      minutes = Math.floor(diff / 1000 / 60);

      totalRenderedTime =
          (hours <= 9 ? "" : "") +
          hours1 +
          " HR " +
          (minutes <= 9 ? "" : "") +
          minutes +
          " MIN ";
      //console.log(totalRenderedTime);
      return totalRenderedTime;
  }
}

function searchByName() {
  var input = document.getElementById("myInput");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("tableResult");
  var tr = table.getElementsByTagName("tr");

  // Close all open collapsibles first
  document.querySelectorAll(".collapsible-content").forEach(row => {
      row.classList.add("d-none");
  });
  document.querySelectorAll(".custom-arrow i").forEach(icon => {
      icon.classList.remove("bi-chevron-down");
      icon.classList.add("bi-chevron-right");
  });

  for (var i = 0; i < tr.length; i++) {
      var mainRow = tr[i];
      var nextRow = tr[i + 1];

      if (mainRow.classList.contains("collapsible-content")) {
          continue;
      }

      var td1 = mainRow.getElementsByTagName("td")[1]; 
      var td2 = mainRow.getElementsByTagName("td")[2]; 

      if (td1 && td2) {
          var txtValue1 = td1.textContent || td1.innerText;
          var txtValue2 = td2.textContent || td2.innerText;
          var isMatch = txtValue1.toUpperCase().indexOf(filter) > -1 || 
                       txtValue2.toUpperCase().indexOf(filter) > -1;

          mainRow.style.display = isMatch ? "" : "none";

          // Handle collapsible content and ck-rows
          if (nextRow && nextRow.classList.contains("collapsible-content")) {
              nextRow.style.display = isMatch ? "" : "none";
              // Find and show all ck-rows within this collapsible content
              nextRow.querySelectorAll('tr').forEach(row => {
                  if (row.classList.contains('ck-row') || !row.getAttribute('class')) {
                      if (isMatch) {
                          row.style.removeProperty('display');
                          row.classList.add('show-row');
                      } else {
                          row.classList.remove('show-row');
                          row.style.display = "none";
                      }
                  }
              });
          }
      }
  }
}


// dropdown for filter by division
function filterTable() {
    var filterValue = document.getElementById("filter").value.trim().toUpperCase();
    var table = document.getElementById("tableResult");
    var tr = table.getElementsByTagName("tr");

    // Close all collapsibles first
    document.querySelectorAll(".collapsible-content").forEach(row => row.classList.add("d-none"));
    document.querySelectorAll(".custom-arrow i").forEach(icon => {
        icon.classList.remove("bi-chevron-down");
        icon.classList.add("bi-chevron-right");
    });

    for (var i = 1; i < tr.length; i++) { // Start at 1 to skip table header
        var mainRow = tr[i];
        var detailsRow = tr[i + 1]; 

        if (mainRow.classList.contains("collapsible-content")) {
            continue;
        }

        var td = mainRow.getElementsByTagName("td")[2]; // 3rd column (Department)

        if (td) {
            var val = td.textContent || td.innerText;
            var isMatch = filterValue === "" || val.toUpperCase().includes(filterValue);

            mainRow.style.display = isMatch ? "" : "none";

            // Handle collapsible content (next row)
            if (detailsRow && detailsRow.classList.contains("collapsible-content")) {
                detailsRow.style.display = isMatch ? "" : "none";

                // Show/hide inner ck-rows inside the collapsible content
                detailsRow.querySelectorAll("tr").forEach(row => {
                    if (row.classList.contains("ck-row") || !row.getAttribute("class")) {
                        if (isMatch) {
                            row.style.removeProperty('display');
                            row.classList.add('show-row');
                        } else {
                            row.classList.remove('show-row');
                            row.style.display = "none";
                        }
                    }
                });
            }
        }
    }
}


function hideSearchFilter() {
  var search = document.getElementById("search-input");
  var filter = document.getElementById("filter");
  var exportBtn = document.getElementById("exportTableView");
  var startDate = document.getElementById("startDate");
  var exportExcelView = document.getElementById("exportExcelView");
  search.style.display = "none";
  filter.style.display = "none";
  exportBtn.style.display = "none";
  startDate.style.display = "none";
  exportExcelView.style.display = "inline-block";
  
}

function showSearchFilter() {
  var search = document.getElementById("search-input");
  var filter = document.getElementById("filter");
  var exportBtn = document.getElementById("exportTableView");
  var startDate = document.getElementById("startDate");
  var exportExcelView = document.getElementById("exportExcelView");
  search.style.display = "inline-block";
  filter.style.display = "inline-block";
  exportBtn.style.display = "inline-block";
  startDate.style.display = "inline-block";
  exportExcelView.style.display = "none";
 
}

let templateWorkbook = null;

async function exportToExcel() {
  if (!templateWorkbook) {
      await loadTemplate();
      if (!templateWorkbook) {
          alert("Failed to load the template. Please try again.");
          return;
      }
  }

  let workbook = XLSX.utils.book_new();

  for (let day = 1; day <= 31; day++) {
      let templateSheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];
      let worksheet = XLSX.utils.sheet_to_json(templateSheet, { header: 1 }); // Convert to array format for editing

      let newData = worksheet.slice(); // Shallow copy to modify per sheet

      for (let key in jsonObject) {
          if (jsonObject.hasOwnProperty(key)) {
              let row = [
                  jsonObject[key].id.toString(),
                  jsonObject[key].name,
                  jsonObject[key].department,
                  "", "", "", "", "", ""
              ];

              let mockCell4 = { textContent: "" };
              let mockCell5 = { textContent: "" };

              splitTime(key, mockCell4, 0, day, day); // Time In
              splitTime(key, mockCell5, 3, day, day);
              
              row[3] = mockCell4.textContent;
              row[4] = mockCell5.textContent;

              

              let mockCell6 = { textContent: "" };
              let mockCell7 = { textContent: "" };
              let mockCell8 = { textContent: "" };
              let mockCell9 = { textContent: "" };

              calculateTimeDifference(key, mockCell8, mockCell5, day);
              overtime(key, mockCell6, mockCell9, mockCell7);

              row[5] = mockCell6.textContent; // Overtime
              row[6] = mockCell7.textContent; // Extra info
              row[7] = mockCell8.textContent; // Total Hours
              row[8] = mockCell9.textContent; // Another value (if applicable)

              newData.push(row);

          }
      }

      let newSheet = XLSX.utils.aoa_to_sheet(newData);
      newSheet["!cols"] = [
          { wch: 8 }, // ID
          { wch: 20 }, // Name
          { wch: 8 }, // Department
          { wch: 8 }, // Time In
          { wch: 8 }, // Time Out
          { wch: 12 }, // Overtime
          { wch: 12 }, // Extra Info
          { wch: 20 }, // Total Hours
          { wch: 12 }  // Another value
      ];
      XLSX.utils.book_append_sheet(workbook, newSheet, `Day ${day}`);
  }

  XLSX.writeFile(workbook, "Monthly_Report.xlsx");
}

document.addEventListener("DOMContentLoaded", () => {
  loadTemplate();
});

async function loadTemplate() {
  try {
      const response = await fetch("/content/Book.xlsx");
      if (!response.ok) throw new Error("Failed to fetch template");

      const arrayBuffer = await response.arrayBuffer();
      templateWorkbook = XLSX.read(arrayBuffer, { type: "array" });

      console.log("Template loaded successfully!");
  } catch (error) {
      console.error("Error loading template:", error);
  }
}
// $("#exportExcelView").click(function(){
//     $("#excelView").table2excel({
//       // exclude CSS class
//       exclude: ".noExl",
//       name: "Worksheet Name",
//       filename: "SomeFile", //do not include extension
//       fileext: ".xls", // file extension
//       preserveColors:true

//     }); 
//   });

function exportToExcel() {
  let table = document.getElementById("excelView");
  let clonedTable = table.cloneNode(true);

  let rows = clonedTable.getElementsByTagName("tr");
  for (let row of rows){
      let firstCell = row.cells[0];
      if(firstCell && firstCell.innerText.trim().startsWith("US")){
          firstCell.colSpan = 17;
      } else if(firstCell && firstCell.innerText.trim().startsWith("Attendance") ){
          firstCell.colSpan = 17;
      } else if (firstCell && firstCell.innerText.trim().startsWith("DHSUD")){
          firstCell.colSpan = 17;
      } else if (firstCell && firstCell.innerText.trim().startsWith("Month")) {
          firstCell.colSpan = 17;
      }
      row.style.textAlign = "center";
      for (let cell of row.cells) {
          cell.style.border = "0.5px solid black";
      }
  }
  // Convert table to HTML string and remove <hr> tags
  let tableHTML = clonedTable.outerHTML.replace(/<hr[^>]*>/g, '<br>');
  
  let htmlBlob = new Blob([
      `<html><head><meta charset="UTF-8"></head><body>${tableHTML}</body></html>`
  ], { type: "application/vnd.ms-excel" });
  
  let link = document.createElement("a");
  link.href = URL.createObjectURL(htmlBlob);
  link.download = "Attendance_Report.xls";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("exportExcelView").addEventListener("click", exportToExcel);
