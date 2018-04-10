var mins = 1;
var hours = 0;
var days = 0;
var weeks = 0;
var name = "";

$("#addmins").click(function () {
  mins += 1;
  $("#minnum").text(mins);
});

$("#deletmins").click(function () {
  mins -= 1;
  $("#minnum").text(mins);
});


$("#addhours").click(function () {
  hours += 1;
  $("#hournum").text(hours);
});
$("#delethours").click(function () {
  hours -= 1;
  $("#hournum").text(hours);
});


$("#adddays").click(function () {
  days += 1;
  $("#daynum").text(days);
});
$("#deletdays").click(function () {
  days -= 1;
  $("#daynum").text(days);
});



document.addEventListener('DOMContentLoaded', function () {
  var d = new Date(Date.now());
  getCurrentTabUrl(function (url, title) {
    //$("#url").val(url);
    $("#name").val(title);
    $("#minnum").text(mins);
    $("#hournum").text(hours);
    $("#daynum").text(days);

    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: true, // Close upon selecting a date,
      min: Date.now(),
      container: '#calendar',
      // ex. 'body' will append picker to body
    });

    $('.timepicker').pickatime({
      default: d.getMinutes() + 30, // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: false, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button,
      container: undefined, // ex. 'body' will append picker to body
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      closeOnSelect: true,
      closeOnClear: false,
      aftershow: function () {} //Function for after opening timepicker
    });

  });
});



$("#tabbutton").click(function () {
    var queryInfo = {
      active: true,
      currentWindow: true
    };
    
    saveTabs(queryInfo,false,false);
});


$("#sessionbutton").click(function () {
  var queryInfo = {
    currentWindow: true
  };

  saveTabs(queryInfo,true,false);
});



function saveTabs(queryInfo,isWindow,test){
  var silent = $("#silent").is(":checked");
  var recurring = false;

  var urls = [];
  var ids = [];
  var time = mins + 60 * hours + 60 * 24 * days + 60 * 24 * 7 * weeks;
  var name = $("#name").val();

  var date = $("#date").val();
  //var time = $("#time").val();  beginning of set up for absolute time

  var newtab = {
    delayInMinutes: time,
    periodInMinutes: null,
  };

  if ($("#name").val() == null || $("#name").val() == "") {
    name = "x";
  }

  chrome.tabs.query(queryInfo, function (tabs) {

    for (i = 0; i < tabs.length; i++) {
      urls.push(tabs[i].url);
      ids.push(tabs[i].id);
    }

    //--- Quick Hack for better presentation
      if (test){
        windowdata = {
           url: urls
       };
       setTimeout(()=>chrome.windows.create(windowdata), 1000);

     }else{
       }

    var info = {
      session: {
        tabs: tabs
      },
      isRecurring: recurring,
      isQuiet: silent,
      window: isWindow
    }

    chrome.alarms.create(name, newtab);
    chrome.storage.sync.set({
      [name]: info
    }, function () {
      $("#success").css("display", "block");
    });

    chrome.runtime.sendMessage({
      added: name
    }, function (response) {});

    chrome.tabs.remove(ids,function(){});

  });



}


$("#absolutetime").click(function () {
  var silent = false;
  var recurring = false;
  var queryInfo = {
    currentWindow: true
  };

  var urls = [];
  var name = $("#name").val();

  var date = $("#date").val();
  var time = $("#time").val();


  date = Date.parse(date);
  //date.setHours(date.getHours() + 50);


  return 0;
  var newtab = {
    delayInMinutes: 0,
    periodInMinutes: null,
  };

  if ($("#name").val() == null || $("#name").val() == "") {
    name = "x";
  }

  chrome.tabs.query(queryInfo, function (tabs) {

    for (i = 0; i < tabs.length; i++) {
      urls.push(tabs[i].url);
    }

    var info = {
      session: {
        tabs: tabs
      },
      isRecurring: recurring,
      isQuiet: silent,
      window: false
    }

    chrome.alarms.create(name, newtab);
    chrome.storage.sync.set({
      [name]: info
    }, function () {
      $("#success").css("display", "block");
    });

    chrome.runtime.sendMessage({
      added: name
    }, function (response) {
      console.log(alarm.name);
    });

  });

});
//---------------------------------------------------------------------------
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    var title = tab.title;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, title);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}