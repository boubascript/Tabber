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
      closeOnSelect: false, // Close upon selecting a date,
      min: Date.now(),
      container: '#calendar',
      // ex. 'body' will append picker to body
      onStart: function () {
        var d = new Date();
        this.set('select', [d.getFullYear(), d.getMonth(), d.getDate()]);
      }
    });

    $('.timepicker').pickatime({
      default: 'now', // d.getMinutes() + 30, // Set default time: 'now', '1:30AM', '16:30'
      twelveHour: true, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button,
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      closeOnSelect: true,
      closeOnClear: false,
      container: "#timepicker",
      init: function () {
        $("#time").val(new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }).replace(" ", ""));
      }
    });

  });
});



$("#tabbutton").click(function () {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  saveTabs(queryInfo, false, false, true);
});


$("#sessionbutton").click(function () {
  var queryInfo = {
    currentWindow: true
  };
  saveTabs(queryInfo, true, false);
});



function saveTabs(queryInfo, isWindow, test, absolute) {
  var silent = $("#silent").is(":checked");
  var recurring = false;

  var urls = [];
  var ids = [];
  var date = $("#date").val();
  var time = null;
  var split = null;

  var newtab = null;

  if (absolute) {
    split = new Date().toString().split(" ");
    time = $("#time").val();
    time = time.split(":");
    time[2] = time[1].slice(-2);
    time[1] = time[1].slice(0, -2);
    if (time[2] === "PM") {
      time[0] = String(Number(time[0]) + 12);
    }
    time.splice(-1);
    time = time.join(":");
    time += (":00 " + split[split.length - 1].replace(/[()]/gi, ""));
    date = date.split(" ");
    date[1] = date[1].slice(0, 3);
    date = date.join(" ");
    time = Date.parse(date + " " + time);
  } else {
    time = mins + 60 * hours + 60 * 24 * days + 60 * 24 * 7 * weeks;
  }

  console.log("time: " + time + ".", "absolute: " + absolute + ".");

  var name = $("#name").val();

  if ($("#name").val() == null || $("#name").val() == "") {
    name = tab[0].title;
  }

  chrome.tabs.query(queryInfo, function (tabs) {

    for (i = 0; i < tabs.length; i++) {
      urls.push(tabs[i].url);
      ids.push(tabs[i].id);
    }

    //--- Quick Hack for better presentation
    if (test) {
      windowdata = {
        url: urls
      };
      setTimeout(() => chrome.windows.create(windowdata), 1000);

    }

    var id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    var info = {
      name: name,
      url: url,
      msg: '',
      session: {
        tabs: tabs
      },
      isRecurring: recurring,
      isQuiet: silent,
      window: isWindow
    }

    if (absolute) {
      newtab = {
        when: time
      };
    } else {
      newtab = {
        delayInMinutes: time,
        periodInMinutes: null,
      };
    }

    chrome.alarms.create(id, newtab);
    chrome.storage.sync.set({
      [id]: info
    }, function () {
      $("#success").css("display", "block");
    });

    chrome.runtime.sendMessage({
      added: name
    }, function (response) {});

    chrome.tabs.remove(ids, function () {});

  });



}

$("#silent").change(function () {

  chrome.storage.sync.set({
    "quiet": $("#silent").checked
  }, function () {
    alert($("#silent").checked);
  });

});


$("#absolutetime").click(function () {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  saveTabs(queryInfo, false, false, true);
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