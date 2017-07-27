$("#deletall").click(function () {
    chrome.alarms.clearAll();
    update();
})


function update(){
    $("#tabschedule").html("");
    var num = 0;
    var row = 1;
    $("tabschedule").innerHTML = "<div class ='row'>";
    //console.log('row added');
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm){
          delet = "<div class ='delete'> <button type= 'button' class='btn btn-default'> X </button></div>";
          link = " <a href ='" + alarm.name.split("+++")[0] + "'>" + alarm.name + "</a>";
          name = alarm.name.split("+++")[1];
          topic = "topic"

          num+=1;
           
         //$("#tabschedule").append(delet + "  " + num + " -- "+ link + "      (time : " + alarm.scheduledTime + ")</p>");
        $("tabschedule").innerHTML += "<div class = 'col s4'>" + 
              "<div class='card blue-grey darken-1'>" + 

              "<div class='card-content white-text'> " + 
              "<span class='card-title'>" + name + " " + delet +  "<a class='btn-floating halfway-fab waves-effect waves-light red'><i class='material-icons'>done</i></a>" + 
              "</span> <p>" + topic + "</p>" + 
              "</div>" + 

              "<div class='card-action'>" + 
              link + "<a href='#'>tab link</a>" + "</div> </div> </div>";
          //console.log('addedtorow');
        
        if(num %3 == 0){
            //row +=3

            $("tabschedule").innerHTML += "</div> <div class ='row'>";
        }

      });
    });
    if (num % 3 != 0){
        $("tabschedule").innerHTML += "</div>";
    }
}

update();
