var selectedDate;

function findLowestNumber(numbers) {
    numbers = numbers.filter(num => num !== null); // Remove null values
    if (numbers.length === 0) return null; // Return null if the array is empty
    
    let lowest = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < lowest) {
            lowest = numbers[i];
        }
    }
    return lowest;
}

function firstNonEmptyKey(data) {
    return data
        .map(entry => {
            const firstNonEmptyKey = Object.keys(entry.records).find(key => entry.records[key].length > 0);
           // console.log(firstNonEmptyKey);
            return firstNonEmptyKey !== undefined ? parseInt(firstNonEmptyKey) : null;
        })
        .filter(value => value !== null); // Remove null values (previously undefined ones)
}

var jsonObject;

window.onload = function() {
    displayJsonDataToTable(); 
};

function displayJsonDataToTable() {
    var jsonData = localStorage.getItem('jsonData');
    if (jsonData) {
    jsonObject = JSON.parse(jsonData);
    selectedDate = findLowestNumber(firstNonEmptyKey(jsonObject));
    updateTable(selectedDate); 
    getMonth();
    }
}

document.getElementById("startDate").addEventListener("change", function (event) {
    selectedDate = event.target.value; 
    //console.log(selectedDate);
    //updateTable(selectedDate); 
    let lastCharDate = selectedDate.slice(-2);
    //console.log(lastCharDate);
    if (lastCharDate[0] == '0') {
        lastCharDate = lastCharDate.replace('0', '');  // Remove '0'
        selectedDate = lastCharDate;
      } else {
        selectedDate = lastCharDate;
      }
    selectedDate = lastCharDate;
    updateTable(selectedDate);
    //console.log(selectedDate);
});

function updateTable(date) {
    var tableBody = document.querySelector('#tableResult tbody');
    tableBody.innerHTML = ""; // Clear previous rows

    for (var key in jsonObject) {
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

            cell1.textContent = jsonObject[key].id;
            cell2.textContent = jsonObject[key].name;
            cell3.textContent = jsonObject[key].department;

            splitTime(key, cell4, 0, date);
            splitTime(key, cell5, 3, date);

            calculateTimeDifference(key, cell8, cell5, date);

            overtime(key, cell6, cell9, cell7);
           // undertime(key, cell7);

            
        } 
    }//getMonth();
}

var timeRecordForDate;
var getFirstTimeIndex;
function splitTime(key, cell4, index) {
    //array records[3] is related to calendar: change
    timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[selectedDate][0] : undefined;
    if (typeof timeRecordForDate === "undefined") {
        cell4.textContent = "-";

    } else {
        var timeToString = timeRecordForDate.toString();
        var splitString = timeToString.split(" ");
        getFirstTimeIndex = splitString[index];
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
       
        calc(getFirstTime, getLastTime, cell8, cell5);
    }
}

var totalRenderedTime, hours, minutes;

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

        hours = Math.floor(diff / 1000 / 60 / 60);
        hours1 = hours - 1;
        diff -= hours * 1000 * 60 * 60;

        minutes = Math.floor(diff / 1000 / 60);

        totalRenderedTime = (hours <= 9 ? "" : "") + hours1 + " HR " + (minutes <= 9 ? "" : "") + minutes + " MIN ";
        //console.log(totalRenderedTime);
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
            var finalConversion = ot + minuteValues(minutes);

    
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
            var finalConversion = ut + minuteValues(undertimeMinutes);

            cell7.textContent = undertime;

        
            cell9.textContent = finalConversion;
        } else {
            cell7.textContent = "-";
        }
    } else {
        cell7.textContent = "Invalid time data";
    }
}


function minuteValues(m){
    let minutes = []; //1-60
    let equivMins = []; //decimal for mins
    let valuesForMins = {};

    if (m === 0){
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

    for(let i=1; i<= equivMins.length; i++){
        minutes.push(i);
    }

    for (let i=0; i<=equivMins.length; i++){
        valuesForMins[minutes[i]] = equivMins[i];
    }
    //console.log();
    return valuesForMins[m];
   //hourValues();
}

function hourValues(h){
    let hours = [1,2,3,4,5,6,7,8]; //1-8
    let equivHours = [0.125, 0.250, 0.375,0.500, 0.625, 0.750, 0.875, 1.000]; //decimal for hours
    let valuesForHours = {};

    for(let i = 0; i<=equivHours.length; i++){
        valuesForHours[hours[i]]=equivHours[i];
    }
    return valuesForHours[h];
}
      function getMonth() {
        const cal = document.getElementById('startDate');
        const getMonth = localStorage.getItem('monthOfFile');
        //const getMonth = "Month : JANUARY 2025";
        var months = ['january', 'february', 'march', 'april', 'may', 'june','july','august','september', 'october', 'november', 'december'];
       

        const regex1 = /Month\s*:\s*(\w+)\s*(\d{4})/;
        const regex2 = /\s*:\s*(\d{2})/;

        let match;

        if (regex1.test(getMonth)) {
            match = getMonth.match(regex1);
            let monthLC = match[1].toLowerCase();
            //let test = "february";
            let monthIndex = months.indexOf(monthLC);
            //console.log("Extracted:", monthIndex+1); 
            const date = new Date(match[2], monthIndex,selectedDate+1);
            const formattedDate = date.toISOString().split('T')[0];
            cal.value = formattedDate;
        } else if (regex2.test(getMonth)) {
            match = getMonth.match(regex2);
            let monthNumber = parseInt(match[1], 10);
            //let monthName = months[monthNumber-1];
            const year = new Date();
            const getYear = year.getFullYear();
            const date = new Date(getYear, monthNumber-1,selectedDate+1);
            const formattedDate = date.toISOString().split('T')[0];
            cal.value = formattedDate;
            console.log("Extracted:", formattedDate); // Output: "02"
        } else {
            console.log("No match found");
        }

      }
 
      function ExcelView(){
        document.getElementById("tabView").addEventListener("click", function() {
            fetch("test2.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById('displayBox').innerHTML = data;
                let file = localStorage.getItem('rawJsondata');
                if (file) {
                  let jsonData = JSON.parse(file);
                  displayTable(jsonData);
                }
               
            })
            .catch(error => {
                console.error("Error loading the file:", error);
            });
        });
    }
    
    ExcelView();
   
    function TableViewDefault(){
        document.getElementById('tableView').addEventListener('click', function(){
            window.location.href = "test3.html";
        });
    }
    TableViewDefault();
    
function displayTable(data) {
    //console.log(data);
    let tableHTML = "<table class='table table-bordered table-striped table-hover'>";
    let excelView  = document.getElementById('excelView');
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
            let timeResults = [];
            var timeio = [];
            for (let i = 1; i < row.length; i++) {
                if (row[i] && typeof row[i] === "string") { 
                    timeResults.push(row[i]);
                } else { timeResults.push(" "); } 
            } 
            timeResults.forEach((timeString, index) => {
                if (timeString === undefined) { 
                    timeString = " ";
                }
                const times = timeString.split(" ");
                const splitTimes = times.length >= 4 ? times[0] + " " + times[3] : timeString;
                
                timeio.push(splitTimes);
            });
            console.log(timeio);
            for (let i = 1; i < maxColumns; i++) {
                tableHTML += `<td>${timeio[i-1]  ??  " "}</td>`;
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

