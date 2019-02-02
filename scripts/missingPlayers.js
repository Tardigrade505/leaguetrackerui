$(document).ready(function () {
    createMissingPlayersTable();
});

function createMissingPlayersTable() {
    // Get season ID
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    console.log('Season ID = ' + seasonId);

    // Get all players in season
    $.getJSON("http://localhost:8080/seasons/" + seasonId + "/players",
        function (json) {
            console.log('Create missing players table json = ' + json);


        }
    );
}