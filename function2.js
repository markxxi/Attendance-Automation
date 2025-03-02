
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
                var cell9 = row.insertCell(8);

                
                cell1.textContent = jsonObject[key].id;
                cell2.textContent = jsonObject[key].name;
                cell3.textContent = jsonObject[key].department;

                
                splitTime(key, cell4, 0);
                splitTime(key, cell5, 3);

                
                calculateTimeDifference(key, cell8, cell5);

                
                overtime(key, cell6, cell9);
                undertime(key, cell7);

                
            }
        } //minuteValues();
    }
}
var timeRecordForDate;
function splitTime(key, cell4, index) {
    //array records[3] is related to calendar: change
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

function calculateTimeDifference(key, cell8, cell5) {
   // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

    if (typeof timeRecordForDate === "undefined") {
        cell8.textContent = "No data";
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
        cell5.textContent = "No time data";
    }
}

function overtime(key, cell6, cell9) {
    
   // var timeRecordForDate = jsonObject[key].records && jsonObject[key].records[3] ? jsonObject[key].records[3][0] : undefined;

    if (typeof timeRecordForDate === "undefined") {
        cell6.textContent = "No data"; 
        return;
    }

    if (hours !== undefined && minutes !== undefined) {
        if (hours > 8) {
            var overtimeHours = hours - 9; 
            //console.log(overtimeHours);
            //var totalOvertime = (overtimeHours <=0 ? "" : overtimeHours + " HRS ") + (minutes <= 9 ? "0" : "") + minutes + " MINS";
            var totalOvertime = "";

        if (overtimeHours > 0) {
            totalOvertime += overtimeHours + " HRS ";
        }

        if (minutes <= 9) {
            totalOvertime += "0" + minutes;
        } else {
            totalOvertime += minutes;
        }
            totalOvertime += " MINS";
            cell6.textContent = totalOvertime;
            //console.log(overtimeHours);
            console.log(hourValues(overtimeHours));
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
        cell7.textContent="No data";
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
    let hours = [1,2,3,4,5,6,7,8]; //1-8
    let equivHours = [0.125, 0.250, 0.375,0.500, 0.625, 0.750, 0.875, 1.000]; //decimal for hours


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

function valueOfMinutesFromOT(minutes){

}