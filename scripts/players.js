$(document).ready(function () {
    getPlayerStandings();
});

function getPlayerStandings() {
    // Get season ID
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    console.log('Season ID = ' + seasonId);

    // Get all players in season
     $.getJSON("http://localhost:8080/seasons/" + seasonId + "/players",
        function (json) {
            console.log('JSON returned = ' + json);

            // Sort the players by most points
            json._embedded.playerList.sort(function(a, b) {
                return b.totalPoints - a.totalPoints;
            });

            // Build the table out of the sorted player list
            var tbody = $('<tbody>');
            for (var i = 0; i < json._embedded.playerList.length; i++) {

                // Alternate table elements
                var tr;
                if (i % 2 == 0) {
                    tr = $('<tr>');
                } else {
                    tr = $('<tr class="table-secondary">');
                }

//                tr.append('<th scope="row">' + (i+1) + '</th>');
                tr.append('<td>' + json._embedded.playerList[i].name + '</td>');
                tr.append('<td>' + json._embedded.playerList[i].totalPoints + '</td>');
//                tr.append('<td>' + json._embedded.playerList[i].totalPoints + '</td>');
                tr.append("</tr>");
                console.log(tr);
                tbody.append(tr);
            }
            tbody.append('</tbody>');
            $('#player-standings').append(tbody);
        });
}

//function getAllPlayers(onCompleteFunction, json) {
//    // Get season ID
//    const urlParams = new URLSearchParams(window.location.search);
//    const seasonId = urlParams.get('seasonId');
//    console.log('Season ID = ' + seasonId);
//
//    // Get all players in season
//    $.getJSON("http://localhost:8080/seasons/" + seasonId + "/players", onCompleteFunction(json));
//}