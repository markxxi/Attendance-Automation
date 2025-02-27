//console.log(localStorage.getItem('jsonData'));
var jsonObject;
window.onload =  function displayJsonDataToTable(){
    var jsonData = localStorage.getItem('jsonData');
   // console.log(jsonData);
    //var jsonData = { name: "John", age: 30, city: "New York" };
    if(jsonData){
        jsonObject = JSON.parse(jsonData);
       // console.log(jsonObject);
        var tableBody = document.querySelector('#tableResult tbody');

        for(var key in jsonObject){
            if(jsonObject.hasOwnProperty(key)){
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
                overtime(cell6);
            }
        }
    }

}

var cell4_emptyTime;
function splitTime(key, cell4, index){
    //to change
    var timeRecordForDate = jsonObject[key].records[3][0];
    if(typeof timeRecordForDate === "undefined"){
        cell4.textContent = "No available data.";
    } else {
        var timeToString = timeRecordForDate.toString();
        var splitString = timeToString.split(" ");
        var getFirstTimeIndex = splitString[index];
        cell4.textContent = getFirstTimeIndex;
        //calculateTimeDifference(key);
        //calc("8:00","17:00");
    }
}

function calculateTimeDifference(key, cell8){
    var timeRecordForDate = jsonObject[key].records[3][0];
    //console.log(timeRecordForDate);
    if(typeof timeRecordForDate==="undefined"){
        timeRecordForDate = "0:00";
    } else {
        var timeToString = timeRecordForDate.toString();
        var splitString = timeToString.split(" ");
        var getFirstTime = splitString[0];
        var getLastTime = splitString[3];
        
        calc(getFirstTime, getLastTime, cell8);
    }
}
var totalRenderedTime, hours, minutes;
function calc(start, end, cell8, key){
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    //console.log(diff);
    hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;

    minutes = Math.floor(diff / 1000 / 60);

    totalRenderedTime = (hours <= 9 ? "0" : "") + hours-1 + " HRS " + (minutes <= 9? "0" : "") + minutes + " MINS ";
    
    //console.log(totalRenderedTime);
    
    cell8.textContent = totalRenderedTime;
    //console.log((hours <= 9 ? "0" : "") + hours-1 + ":" + (minutes <= 9 ? "0" : "") + minutes);

    }   

    function overtime(cell6){
        if(!totalRenderedTime == 0){
        if (hours > 8){
            var minusHrs = hours - 9;
            //console.log(minusHrs);
            var totalOvertime = minusHrs + " " + minutes;
            cell6.textContent = totalOvertime.replace("0", " ");
            //console.log(hours - 9 + " " + minutes);
        } else {
            cell6.textContent = totalOvertime.replace("0"," ") + minutes;
        }
    } else {
        console.log("-");
    }
    }