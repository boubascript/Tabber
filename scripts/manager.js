var windowdata = {};

function reload(){
    update();
    showTimers();
    setInterval(showTimers, 1000);
}

$( document ).ready(function() {
    reload();
});



var num = 0;
var tasks = {};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      reload();
   });


// "<p id = 'time'>" + days + " days, " + hours + " hours, " + minutes + " minutes" + seconds + " seconds" + " </p>"
function update(){
    $("#alarmList").html("");
    $("#alarmList").append("<div id = 'alarms' class = 'row' ></div");
    var pos = 1;
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm){
          num+=1;

        // chrome.storage.sync.get([alarm.name], function(result){
        //     console.log(result);
        // });
          var title = alarm.name.split("|||")[0];
          var url = alarm.name.split("|||")[1];
          var msg = alarm.name.split("|||")[2];
   


          delet = " <a id = 'x"+ num + "' href = '#' class='waves-effect waves-red btn-flat red deleter'> <i class='material-icons medium'>delete_forever</i> </a>";
          link = " <a target = '_blank' href ='" + url + "'> LINK </a>";

          var name = alarm.name.replace(/\s+/g, '-').replace(/\\/g, '').replace(/\?/g, '');


          //$("#alarmList").append(delet + "  " + num + " -- "+ link + "      (time : " + alarm.scheduledTime + ")</p>");
          card = "<div id = '" + name + "'class = 'col s4'>" + 
              "<div class='card blue-grey darken-1'>" + 

              "<div class='card-content white-text'> " + 
              "<span class='card-title'>" + "<div class = 'row'><div class = 'col s9'>" + title + 
              "</div><div class = 'col s3'>" + delet + "</div></div>" +  
              "</span>" + "<p id = 't-" + name + "'> </p>" + 
              "</div>" + 
              "<a target = '_blank' href = '" + url + "'class='btn-floating halfway-fab waves-effect waves-light teal'><i class='material-icons'>near_me</i></a>" +
              "<div class='card-action'>" + 
              link + "</div> </div> </div>";

          $("#alarms").append(card);
        //   if(num % 3 == 0){
        //       pos += 3
        //       $("#alarmList").append("<div id = '" + pos + "' class = 'row'></div");
        //   }
      });

    });
}


function showTimers(){
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm){
        var timeleft = alarm.scheduledTime - Date.now();
        timeleft = new Date(alarm.scheduledTime).getTime() - Date.now();
  
        var sec = 1000;
        var min = 60 * sec;
        var hour = 60 * min;
        var day = 24 * hour;
        var week = 7 * day;

      // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        var name = alarm.name.replace(/\s+/g, '-').replace(/\\/g, '').replace(/\?/g, '');

        // console.log(days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds");
        // console.log("#t-" + name);
        $("#t-" + name).text(days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds");
      });

    });
}


$("#deletall").click(function () {
    chrome.alarms.clearAll();
    reload();
});


//-- Not yet functional
// for(x = 1;x<=num;x++){
//     $("#x"+ num).click(function() {
//         $("#card"+ num).detach();
//         console.log("detached");
//     });
// }



//---------------------- Tests For Event Page, Don't Use Here (Ignore)
// chrome.alarms.onAlarm.addListener(function( alarm ) {
  
//     var urls = [];

//     chrome.storage.sync.get([alarm.name], function(result) {
//       var info = result[alarm.name];

//       for(i = 0; i < info.session.tabs.length; i++){
//         urls.push(info.session["tabs"][i].url);
//         }

//         console.log(urls);
//         windowdata = {
//             url: urls
//           };
      
//           chrome.windows.create(windowdata);

//        if(!(info.isRecurring)){
//         chrome.storage.sync.remove([alarm.name], function() {
//             console.log("remoooved");
//             console.log(alarm.name);
//         });
//        }

//     });

//     chrome.runtime.sendMessage({alarm: alarm.name}, function(response) {
//         console.log(alarm.name);
//       });

//   });

chrome.runtime.getPlatformInfo(function(info) {
    // Display host OS in the console
    console.log(info.os);
});



