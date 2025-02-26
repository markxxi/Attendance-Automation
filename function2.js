//console.log(localStorage.getItem('jsonData'));
var jsonObject;
window.onload =  function displayJsonDataToTable(){
    var jsonData = localStorage.getItem('jsonData');
    console.log(jsonData);
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
                cell1.textContent = jsonObject[key].id;
                cell2.textContent = jsonObject[key].name;
                cell3.textContent = jsonObject[key].department;
                cell4.textContent = jsonObject[key].records[3][0];
            }
        }
    }
   // displayTime();
}

function splitTime(){
    //var cell4 = row.insertCell(3);
    for(var key in jsonObject){
    var timeRecordForDate = jsonObject[key].records[3][0];
    //timeRecordForDate.toS
    }
}