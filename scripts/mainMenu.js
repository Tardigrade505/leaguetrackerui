$(document).ready(function () {
    listPlayersAsCloseableTags();
});

function navigateToGamePage() {
    // Get season ID
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    console.log('Season ID = ' + seasonId);

    // Move to game page
    window.location.href="missingPlayers.html?seasonId=" + seasonId;
}

function checkForMissingPlayers() {
    $('#missing-players-modal').modal('show');
}

function listPlayersAsCloseableTags() {
    // Get season ID
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    console.log('Season ID = ' + seasonId);

    // Get all players in season
    $.getJSON("http://localhost:8080/seasons/" + seasonId + "/players",
       function (json) {
           console.log('JSON returned = ' + json);

           // Build the list out of the player list
           // <button type="button" class="btn btn-outline-primary">Primary   <span class="close">&times;</span></button>
           var buttonItemList = $('<li>');
           for (var i = 0; i < json._embedded.playerList.length; i++) {
                buttonItemList.append('<button type="button" class="btn btn-outline-primary" name="player-button" value=' + json._embedded.playerList[i].name + '>' + json._embedded.playerList[i].name + '<span class="close">&times;</span></button>');
           }
           buttonItemList.append('</li>');
           console.log('List = ' + buttonItemList);
           $('#missing-player-list').append(buttonItemList);


           // Add event listener to close the buttons
            var i;
            var closebtns = document.getElementsByClassName("close");

            for (i = 0; i < closebtns.length; i++) {
                closebtns[i].addEventListener("click", function() {
                this.parentElement.parentNode.removeChild(this.parentElement);
                });
            }
       });
}

function submitPlayerList() {
    // Get season ID
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    console.log('Season ID = ' + seasonId);

    // Gather player list
    var players = document.getElementsByName("player-button");

    var playerList = [];
    var playerListString = "?";
    for (i = 0; i < players.length; i++) {
        playerList.push(players[i].value);
        playerListString = playerListString + "playerList=" + players[i].value + "&";
    }
    var nextPageParams = playerListString + "seasonId=" + seasonId;
    window.location.href="game.html" + nextPageParams;
//    var url = "http://localhost:8080/games" + queryParams;
//    console.log("Create game URL = " + url);
//
//
//    // Get a new game
//    $.getJSON(url,
//       function (json) {
//           console.log('JSON returned = ' + json);

//           // Build the list out of the player list
//           // <button type="button" class="btn btn-outline-primary">Primary   <span class="close">&times;</span></button>
//           var buttonItemList = $('<li>');
//           for (var i = 0; i < json._embedded.playerList.length; i++) {
//                buttonItemList.append('<button type="button" class="btn btn-outline-primary" name="player-button" value=' + json._embedded.playerList[i].name + '>' + json._embedded.playerList[i].name + '<span class="close">&times;</span></button>');
//           }
//           buttonItemList.append('</li>');
//           console.log('List = ' + buttonItemList);
//           $('#missing-player-list').append(buttonItemList);
//
//
//           // Add event listener to close the buttons
//            var i;
//            var closebtns = document.getElementsByClassName("close");
//
//            for (i = 0; i < closebtns.length; i++) {
//                closebtns[i].addEventListener("click", function() {
//                this.parentElement.parentNode.removeChild(this.parentElement);
//                });
//            }
//       });
}
