$(document).ready(function() {
console.log("HERE")
    $.ajax({
        url: "http://league-tracker-rest-api-java-2.mybluemix.net/seasons"
    }).then(function(data, status, jqxhr) {
       $('#seasons-id').text(jqxhr.responseText);
       $('#seasons-content').html("HI")

       console.log(data);
       console.log("HE");
       console.log("STRING");
    });
});

//$(document).ready(function() {
//    $.ajax({
//        url: "http://league-tracker-rest-api-java-2.mybluemix.net/seasons"
//    }).then(function(data) {
//       $('.seasons-id').append(data.id);
//       $('.seasons-content').append(data.content);
//    });
//});
//$.get("http://league-tracker-rest-api-java-2.mybluemix.net/seasons",
//    function(data, statusTxt){
//       $('#tcg_query_output').html(data);
//    });
