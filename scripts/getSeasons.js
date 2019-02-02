$(document).ready(function() {
console.log("HERE")
    $.ajax({
        url: "http://localhost:8080/seasons"
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
//        url: "http://localhost:8080/seasons"
//    }).then(function(data) {
//       $('.seasons-id').append(data.id);
//       $('.seasons-content').append(data.content);
//    });
//});
//$.get("http://localhost:8080/seasons",
//    function(data, statusTxt){
//       $('#tcg_query_output').html(data);
//    });
