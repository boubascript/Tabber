$("#deletall").click(function () {
    alert("yah");
    chrome.alarms.clearAll();
    alert("yah");
    update();
})


function update(){
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm, num){
          num+=1;
          delet = " <p class = 'well'> <button type= 'button' id = '" + num + "' class='btn btn-default'> X </button>";
          link = " <a href ='" + alarm.name + "'>" + alarm.name + "</a>";
          $("#alarmList").append(delet + "  " + num + " -- "+ link + "      (time : " + alarm.scheduledTime + ")</p>");
      });
    });
}

update();
