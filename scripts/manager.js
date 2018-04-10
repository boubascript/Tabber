
$(document).ready(function () {
    reload();
  });

function reload() {
  update();
  showTimers();
  setInterval(showTimers, 1000);
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    reload();
  });


// "<p id = 'time'>" + days + " days, " + hours + " hours, " + minutes + " minutes" + seconds + " seconds" + " </p>"

/* ICONS: 
open session: open_in_new
view tabs:     menu
view:        unfold_more 
upcoming:     priority_high
more_vert

*/


function update() {
  $("#alarmList").html("");
  $("#alarmList").append("<div id = 'alarms' class = 'row' ></div");

  var times = [];
  var sortedAlarms = {};
  var length = 0
  var count = 0;
    chrome.alarms.getAll(function (alarms) {
        alarms.forEach(function (alarm) {
            times.push(alarm.scheduledTime);
            sortedAlarms[alarm.scheduledTime] = alarm.name;
        });

        times.sort(function(a, b){return a - b});

        for(i = 0; i < times.length; i++ ){
            console.log(times[i]);
            chrome.alarms.get(sortedAlarms[times[i]], function (alarm) {
                    var name = alarm.name
                    var ID = name.replace(/[^\w]/gi, '-');
            
                //   chrome.storage.sync.get([alarm.name], function(result){
                //       console.log(result);
                //   });
            
                console.log(alarm.name);
            
                  delet = " <a id = 'x" + ID + "' href = '#' class='left waves-effect waves-red '><i class='material-icons'>delete</i></a>";
                  link = " <a target = '_blank' href ='" + ID + "'> LINK </a>";
                  open =  "<a target = '_blank' href = '" + ID + "'class='right btn-floating waves-effect waves-light teal'><i class='material-icons'>open_in_new</i></a>"
                  view =  "<a target = '_blank' href = '" + ID + "'class='right btn-floating waves-effect waves-light teal'><i class='material-icons'>menu</i></a>"
            
            
                  card = "<div id = 'card-" + ID + "'class = 'col s3'>" +
                    "<div class='card blue-grey darken-1'>" +
            
                    "<div class='card-content white-text'> " +
                        "<span title = '"  + name + "' class='card-title ellipsis activator grey-text text-darken-4'>" + name + "</span>" +
                        //"<p><a href='#'>This is a link</a></p>" +
                        "</span>" + "<p class = 'time' id = 't-" + ID + "'> </p>" +
                    "</div>"  +
            
                    "<div class='card-action'>" +
                        link + delet + view + 
                    
                    "</div> </div> </div>";
            
                  $("#alarms").append(card);
            
                });
        }

    });

  
//   chrome.alarms.getAll(function (alarms) {
//     alarms.forEach(function (alarm) {
//         var name = alarm.name
//         var ID = name.replace(/[^\w]/gi, '-');

//     //   chrome.storage.sync.get([alarm.name], function(result){
//     //       console.log(result);
//     //   });

//     console.log(alarm.name);

//       delet = " <a id = 'x" + ID + "' href = '#' class='left waves-effect waves-red '><i class='material-icons'>delete</i></a>";
//       link = " <a target = '_blank' href ='" + ID + "'> LINK </a>";
//       open =  "<a target = '_blank' href = '" + ID + "'class='right btn-floating waves-effect waves-light teal'><i class='material-icons'>open_in_new</i></a>"
//       view =  "<a target = '_blank' href = '" + ID + "'class='right btn-floating waves-effect waves-light teal'><i class='material-icons'>menu</i></a>"


//       card = "<div id = 'card-" + ID + "'class = 'col s4'>" +
//         "<div class='card blue-grey darken-1'>" +

//         "<div class='card-content white-text'> " +
//             "<span title = '"  + name + "' class='card-title ellipsis activator grey-text text-darken-4'>" + name + "</span>" +
//             "<p><a href='#'>This is a link</a></p>" +
//             "</span>" + "<p id = 't-" + ID + "'> </p>" +
//         "</div>"  +

//         "<div class='card-action'>" +
//             link + delet + view + 
        
//         "</div> </div> </div>";

//       $("#alarms").append(card);

//     });

//   });
  

}


function showTimers() {
  chrome.alarms.getAll(function (alarms) {
    alarms.forEach(function (alarm) {
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

      var name = alarm.name;
      var ID = name.replace(/[^\w]/gi, '-');

      // console.log(days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds");
      // console.log("#t-" + name);
      var timelabel = seconds + " seconds";
      if(minutes != 0){
          timelabel = minutes + " minutes, " + timelabel;
      }
      if(hours != 0){
        timelabel = hours + " hours, " + timelabel;
      }
      if(days != 0){
        timelabel = days + " days, " + timelabel;
      }

      
      $("#t-" + ID).text(timelabel);
      if(days == 0 && hours == 0 && minutes < 5){
        $("#t-" + ID).css('color', 'red');
        timelabel += "!"
      }

      $("#t-" + ID).text(timelabel);

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

chrome.runtime.getPlatformInfo(function (info) {
  // Display host OS in the console
  console.log(info.os);
});