$("#deletall").click(function () {
    chrome.alarms.clearAll();
    update();
})

var num = 0;

function update(){
    $("#alarmList").html("");
    var pos = 1;
    $("#alarmList").append("<div id = '" + pos + "' class = 'row'></div");
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm){
          num+=1;
          var title = alarm.name.split("|||")[0];
          var url = alarm.name.split("|||")[1];
          var msg = alarm.name.split("|||")[2];
          console.log(title + url);
          delet = " <a id = 'x"+ num + "' href = '#' class='waves-effect waves-red btn-flat red deleter'> <i class='material-icons large'>delete_forever</i> </a>";
          link = " <a target = '_blank' href ='" + url + "'> LINK </a>";


          //$("#alarmList").append(delet + "  " + num + " -- "+ link + "      (time : " + alarm.scheduledTime + ")</p>");
          card = "<div id = 'card" + num + "'class = 'col s4'>" + 
              "<div class='card blue-grey darken-1'>" + 

              "<div class='card-content white-text'> " + 
              "<span class='card-title'>" + "<div class = 'row'><div class = 'col s9'>" + title + 
              "</div><div class = 'col s3'>" + delet + "</div></div>" +  
              "</span>" + "<p>" + msg + "</p>" + 
              "</div>" + 
              "<a target = '_blank' href = '" + url + "'class='btn-floating halfway-fab waves-effect waves-light teal'><i class='material-icons'>near_me</i></a>" +
              "<div class='card-action'>" + 
              link + "</div> </div> </div>";

          $("#" + pos).append(card);
          if(num % 3 == 0){
              pos += 3
              $("#alarmList").append("<div id = '" + pos + "' class = 'row'></div");
          }
      });

    });
}

for(x = 1;x<=num;x++){
    $("#x"+ num).click(function() {
        $("#card"+ num).detach();
        console.log("detached");
    });
}

$(".deleter").click(function() {
    $("#card" + this.id.split("x")[1]).remove();
    console.log("remove");

});

update();
