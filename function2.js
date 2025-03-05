var selectedDate;
function findLowestNumber(numbers) {
    let lowest = numbers[0];  

    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < lowest) {
            lowest = numbers[i];
        }
    }

    return lowest;
}

function firstNonEmptyKey (data){
    return data.map(entry => {
        const firstNonEmptyKey = Object.keys(entry.records).find(key => entry.records[key].length > 0);
        return firstNonEmptyKey ? parseInt(firstNonEmptyKey) : null; 
      });
}

var jsonObject;
window.onload = function displayJsonDataToTable() {
    var jsonData = localStorage.getItem('jsonData');
    if (jsonData) {
    jsonObject = JSON.parse(jsonData);
    selectedDate = findLowestNumber(firstNonEmptyKey(jsonObject));
    //console.log(selectedDate);
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

            overtime(key, cell6, cell9, date);
            undertime(key, cell7, date);

            
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
        cell8.textContent = totalRenderedTime;
    } else {
        cell8.textContent = "No time data"; 
        cell5.textContent = "No time data";
    }
}

function overtime(key, cell6, cell9) {
    
   // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

    if (typeof timeRecordForDate === "undefined") {
        cell6.textContent = "-"; 
        return;
    }

    if (hours !== undefined && minutes !== undefined) {
        if (hours > 8) {
            var overtimeHours = hours - 9; 
            //console.log(overtimeHours);
            //var totalOvertime = (overtimeHours <=0 ? "" : overtimeHours + " HRS ") + (minutes <= 9 ? "0" : "") + minutes + " MINS";
            var totalOvertime = "";

        if (overtimeHours > 0) {
            totalOvertime += overtimeHours + " HR ";
        }

        if (minutes <= 9) {
            totalOvertime += "" + minutes;
        } else {
            totalOvertime += minutes;
        }
            totalOvertime += " MIN";
            cell6.textContent = totalOvertime;
            //console.log(overtimeHours);
            //console.log(hourValues(overtimeHours));
            var ot = hourValues(overtimeHours);
            if (typeof ot === "undefined"){
               ot = 0.0;
               //console.log(ot);
            }
            //add typeof for minute values
            var finalConversion = ot+minuteValues(minutes);
            if (typeof finalConversion === "undefined"){
                cell9.textContent = "No data."
                return;
            }
           cell9.textContent = finalConversion;
        } else {
            cell6.textContent = "No overtime"; 
        }
    } else {
        cell6.textContent = "Invalid time data"; 
    }
}

function undertime(key, cell7){
    if (typeof timeRecordForDate === "undefined"){
        cell7.textContent="-";
        return;
    }

    if (hours !== undefined && minutes !== undefined){
        if(hours < 8){
            var undertimeHours = 8-hours;
            //console.log(undertimeHours);
        } else {
            cell7.textContent = "-";
        }
    } else {
        cell7.textContent = "Invalid time data"
    }
}

function minuteValues(m){
    let minutes = []; //1-60
    let equivMins = []; //decimal for mins
    let valuesForMins = {};



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
/*
function getMonth(){
    const cal= document.getElementById('startDate');
    // const getMonth = localStorage.getItem('monthOfFile');
    const getMonth = "Month : January 2025";
    const regex = /Month\s*:\s*(\w+)\s*(\d{4})/;
    const regexconv = getMonth.match(regex);
    const year = regexconv[2];
    const month = regexconv[0].match(/Month\s*:\s*(\w+)\s*(\d{4})/)[1];
    //console.log(month);
    var months = ['January', 'February', 'March', 'April', 'May'];
    
    let monthIndex = months.indexOf(month);
    if(monthIndex!== -1){
        let monthvalueindate = monthIndex+1;
        const date = new Date(year, monthvalueindate, 1);
        const formattedDate = date.toISOString().toString('T')[0];
        cal.value = formattedDate;
    } else {
        console.log("Not found.");
    }

    //const date = new Date(year, month,1); 
    //const formattedDate = date.toISOString().split('T')[0]; 

    //cal.value = formattedDate;
} */
    function getMonth() {
        const cal = document.getElementById('startDate');
    
        //const getMonth = "Month : March 2025";  // replace with actual data or localStorage.getItem('monthOfFile')
        const getMonth = localStorage.getItem('monthOfFile');
        console.log(getMonth);
        const regex = /Month\s*:\s*(\w+)\s*(\d{4})/;
        const regexconv = getMonth.match(regex);
        const year = regexconv[2];
        const month = regexconv[1].toLowerCase();  // 'January'
        
        var months = ['january', 'february', 'march', 'april', 'may', 'june','july','august','september', 'october', 'november', 'december'];
        
        let monthIndex = months.indexOf(month);
        //console.log(monthIndex);
        if (monthIndex !== -1) {
          let monthValueInDate = monthIndex;  
          console.log(selectedDate);
          const date = new Date(year, monthValueInDate, selectedDate+1);  
          console.log(date);
          const formattedDate = date.toISOString().split('T')[0];
          console.log(formattedDate);
          console.log(formattedDate);
          cal.value = formattedDate;
        } else {
          console.log("Month not found.");
        }
      }
 
      function changeview(){
        document.getElementById("tabView").addEventListener("click", function() {
            fetch("test2.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById('displayBox').innerHTML = data;
                let file = localStorage.getItem('rawJsondata');
                if (file) {
                  let jsonData = JSON.parse(file);
                  createTable(jsonData);
                }
               
            })
            .catch(error => {
                console.error("Error loading the file:", error);
            });
        });
    }
    
    changeview();

        function createTable(data) {
          let table = document.getElementById('yyyy');
          table.innerHTML = ""; // Clear previous table
      
          if (data.length === 0) return;
      
          // Create Table Header
          let thead = document.createElement('thead');
          let headerRow = document.createElement('tr');
          Object.keys(data[0]).forEach(key => {
            let th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
          });
          thead.appendChild(headerRow);
          table.appendChild(thead);
      
          // Create Table Body
          let tbody = document.createElement('tbody');
          data.forEach(row => {
            let tr = document.createElement('tr');
            Object.values(row).forEach(value => {
              let td = document.createElement('td');
              td.textContent = value;
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
        
    
    }

