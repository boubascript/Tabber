var url = "";
var windowdata = {};


chrome.alarms.onAlarm.addListener(function (alarm) {
  var urls = [];

  chrome.storage.sync.get([alarm.name], function (result) {
    var info = result[alarm.name];

    for (i = 0; i < info.session.tabs.length; i++) {
      urls.push(info.session["tabs"][i].url);
    }

      chrome.storage.sync.get(["quiet"], function (result) {
        console.log(result.quiet);
          if(result.quiet){
            chrome.windows.getLastFocused(function(window){
              console.log(window);
              console.log(window.id);
              for (i = 0; i < urls.length; i++) {
                var info = {
                  windowId:window.id,
                  url: urls[i],
                  active: false
                }
                chrome.tabs.create(info, function(tab){});
              }

            });
          }

          else{
            console.log("not quiet");
            windowdata = {
              url: urls,
              focused: false
            };
        
            chrome.windows.create(windowdata);
          }
        });

    if (!(info.isRecurring)) {
      chrome.storage.sync.remove([alarm.name], function () {
        console.log("remoooved");
        console.log(alarm.name);
      });
    }

  });

  chrome.runtime.sendMessage({
    added: alarm.name
  }, function (response) {
    console.log(alarm.name);
  });

});




//------------------- Older Code 

// chrome.alarms.onAlarm.addListener(function( alarm ) {
//   console.log("Got an alarm!", alarm);

//   urls = [];
//   chrome.storage.sync.get([alarm.name], function(result) {
//     console.log('Value currently is ' + result.key);
//     urls = result.session.tabs;
//   });


//   // var session = tasks[alarm.name];
//   // var urls = []
//   // for(i = 0; i < session.tabs.length; i++){
//   //        urls.push(session.tabs[i].url);
//   //   }

//     // windowdata = {
//     //   url: urls
//     // };

//     // chrome.windows.create(windowdata);

//   // if(alarm.name.split("|||")[1] != ""){
//   //   windowdata = {
//   //     url: alarm.name.split("|||")[1]
//   //   };

//   //   chrome.windows.create(windowdata);
//   // } else{
//     // chrome.runtime.onMessage.addListener(
//     //   function(request, sender, sendResponse) {
//     //     var urls = [];
//     //     console.log(sender.tab ?
//     //                 "from a content script:" + sender.tab.url :
//     //                 "from the extension");

//     //     for(i = 0; i < request.length; i++){
//     //       urls.push(request[i].url);
//     //     }

//     //     windowdata = {
//     //       url: urls
//     //     };

//     //     chrome.windows.create(windowdata);
//     //     //sendResponse({r: "what"});

//     //     //chrome.windows.create(windowdata);

//     //     // if (request.greeting == "hello")
//     //     //   sendResponse({farewell: "goodbye"});

//     //   });
//   //}

// });