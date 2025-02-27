var jsonObject;
window.onload = function displayJsonDataToTable() {
    var jsonData = localStorage.getItem('jsonData');
    if (jsonData) {
        jsonObject = JSON.parse(jsonData);
        var tableBody = document.querySelector('#tableResult tbody');

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

                
                cell1.textContent = jsonObject[key].id;
                cell2.textContent = jsonObject[key].name;
                cell3.textContent = jsonObject[key].department;

                
                splitTime(key, cell4, 0);
                splitTime(key, cell5, 3);

                
                calculateTimeDifference(key, cell8);

                
                overtime(key, cell6);
                undertime(key, cell7);
            }
        }
    }
}
var timeRecordForDate;
function splitTime(key, cell4, index) {
    //arrays is related to calendar: change
    timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;
    if (typeof timeRecordForDate === "undefined") {
        cell4.textContent = "No available data.";
    } else {
        var timeToString = timeRecordForDate.toString();
        var splitString = timeToString.split(" ");
        var getFirstTimeIndex = splitString[index];
        cell4.textContent = getFirstTimeIndex;
    }
}

function calculateTimeDifference(key, cell8) {
   // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

    if (typeof timeRecordForDate === "undefined") {
        cell8.textContent = "No data";
    } else {
        var timeToString = timeRecordForDate.toString();
        var splitString = timeToString.split(" ");
        var getFirstTime = splitString[0];
        var getLastTime = splitString[3];

        calc(getFirstTime, getLastTime, cell8);
    }
}

var totalRenderedTime, hours, minutes;

function calc(start, end, cell8) {
    if (start && end) { https://legendary-tribble-6994447q9jr53rwpq.github.dev/
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

        totalRenderedTime = (hours <= 9 ? "0" : "") + hours1 + " HRS " + (minutes <= 9 ? "0" : "") + minutes + " MINS ";
        cell8.textContent = totalRenderedTime;
    } else {
        cell8.textContent = "No time data"; 
    }
}

function overtime(key, cell6) {
    
   // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

    if (typeof timeRecordForDate === "undefined") {
        cell6.textContent = "No data"; 
        return;
    }

    if (hours !== undefined && minutes !== undefined) {
        if (hours > 8) {
            var overtimeHours = hours - 9; 
            console.log(overtimeHours);
            var totalOvertime = (overtimeHours <=0 ? "" : overtimeHours + " HRS ") + (minutes <= 9 ? "0" : "") + minutes + " MINS";
            cell6.textContent = totalOvertime;
        } else {
            cell6.textContent = "No overtime"; 
        }
    } else {
        cell6.textContent = "Invalid time data"; 
    }
}

function undertime(key, cell7){
    if (typeof timeRecordForDate === "undefined"){
        cell7.textContent="No data";
        return;
    }

    if (hours !== undefined && minutes !== undefined){
        if(hours < 8){
            var undertimeHours = 8-hours;
            console.log(undertimeHours);
        } else {
            cell7.textContent = "-";
        }
    } else {
        cell7.textContent = "Invalid time data"
    }
}

function testAssign (){
    equiv = {};
    for(i =0 ; i <= 3; i++){
        
    }
}