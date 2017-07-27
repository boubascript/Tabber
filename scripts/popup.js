
var mins = 2;
var hours = 0;
var days  = 0;
var weeks = 0;
var msg = "";


$("#addmins").click(function() {
    mins += 1;
   $("#minnum").text(mins);
});

$("#deletmins").click(function() {
    mins -= 1;
   $("#minnum").text(mins);
});


$("#addhours").click(function() {
    hours += 1;
   $("#hournum").text(hours);
});
$("#delethours").click(function() {
    hours -= 1;
   $("#hournum").text(hours);
});


$("#adddays").click(function() {
    days += 1;
   $("#daynum").text(days);
});
$("#deletdays").click(function() {
    days -= 1;
   $("#hournum").text(days);
});


document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    $("#url").val(url);
    $("#message").text(msg);
    $("#minnum").text(mins);
    $("#hournum").text(hours);
    $("#daynum").text(days);
      
  });
});


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

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;


    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
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



$("#tabbutton").click(function () {

getCurrentTabUrl(function(url) {
    var time = mins + 60*hours + 60*24*days + 60*24*7*weeks;
    var newtab = {
     delayInMinutes: time, 
     periodInMinutes: null,
     };

    chrome.alarms.create(url + "+++" + msg, newtab);
  $("#success").css("display","block");
  $("#url").val("");
  $("#minutes").val("");
  $("#message").val("");

   });
});
                      




