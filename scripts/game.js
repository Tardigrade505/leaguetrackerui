$(document).ready(function () {
    displayGame();
    fillPlayerHeaders();
//    postAchievementsToSlack();
});

function nextPage() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');
    window.location.href="recordResults.html?seasonId=" + seasonId;
}

/**
* Posts the achievements to Slack
*/
function postAchievementsToSlack() {
    // Retrieve stored game information
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    var playerInFirst = JSON.parse(sessionStorage.getItem('playerInFirst'));
    var playerInLast = JSON.parse(sessionStorage.getItem('playerInLast'));

    var slackBody ='{"text": "*Cheevos!*", "attachments": [';
    for (i = 0; i < gameJSON.achievements.length; i++) {
        if (i == gameJSON.achievements.length - 1) {
            var cheevoAttachment = '{"author_name": "Cheevo Bot", "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/a8304/img/api/homepage_custom_integrations-2x.png", "image_url": "http://league-tracker-ui-2.mybluemix.net/images/' + gameJSON.achievements[i].name + '.png" }, { "title": "Eligible Players", "text": "' + playerInLast + '"}';
            cheevoAttachment += ']}';
        } else {
            var cheevoAttachment = '{"author_name": "Cheevo Bot", "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/a8304/img/api/homepage_custom_integrations-2x.png", "image_url": "http://league-tracker-ui-2.mybluemix.net/images/' + gameJSON.achievements[i].name + '.png" }, { "title": "Eligible Players", "text": "NOT ' + playerInFirst + '"}';
            cheevoAttachment += ',';
        }
        slackBody += cheevoAttachment;
    }
    console.log('Slack body = ' + slackBody);

    // Post the achievements to slack
    $.ajax({
        type: 'POST',
//        beforeSend: function(request) {
//            request.setRequestHeader("Content-type", "application/json");
//        },
        url: 'https://hooks.slack.com/services/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',
//        data: '{ "text": "Cheevos!", "attachments": [{ "title": "For NOT Elliot", "fields": [{ "title": "Volume", "value": "1", "short": true }, { "title": "Issue", "value": "3", "short": true } ], "author_name": "Stanford S. Strickland", "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/a8304/img/api/homepage_custom_integrations-2x.png", "image_url": "http://league-tracker-ui-2.mybluemix.net/images/yaBasic.png" }, { "title": "Synopsis", "text": "After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..." } ] }'
        data: slackBody,
    }).done(function(response) {
        console.log('Successfully  POSTed results');
//        window.location.href="mainMenu.html?seasonId=" + seasonId;
    }).fail(function(data) {
        console.log('Failed to POST results: ' + data);
    });
}

/**
* Updates the headers with player in first and player in last with the players in first
* and in last in the season. If this is the first session and no one has any points,
* do not display the player in first and player in last headings
*/
function fillPlayerHeaders() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Get all players in season
    $.getJSON("http://league-tracker-rest-api-java-2.mybluemix.net/seasons/" + seasonId + "/players",
        function (json) {
            console.log('JSON returned = ' + json);
            var noPoints = false;

            // Check for edge case where all players have 0 points
            var pointsSum = 0;
            for (i = 0; i < json._embedded.playerList.length; i++) {
                console.log('Player = ' + json._embedded.playerList[i].name + ' points = ' + json._embedded.playerList[i].totalPoints);
                pointsSum += json._embedded.playerList[i].totalPoints;
            }
            if (pointsSum == 0) {
                noPoints = true;
            }


            // Sort the players by most points
            json._embedded.playerList.sort(function(a, b) {
            return b.totalPoints - a.totalPoints;
            });

            // Get all players in first and store them
            var playersInFirst = [];
            var firstPlacePoints = json._embedded.playerList[0].totalPoints;
            playersInFirst.push(json._embedded.playerList[0].name);

            for (i = 1; i < json._embedded.playerList.length; i++) {
                if (json._embedded.playerList[i].totalPoints == firstPlacePoints) {
                    playersInFirst.push(json._embedded.playerList[i].name);
                } else {
                    break;
                }
            }

            // Store the players in first for later pages
//                var playerInFirst = json._embedded.playerList[0].name;
            sessionStorage.setItem("playerInFirst", JSON.stringify(playersInFirst));

            // Get all players in first and store them
            var playersInLast = [];
            console.log('TEST LENGTH = ' + playersInLast.length);
            var lastPlacePoints = json._embedded.playerList[json._embedded.playerList.length - 1].totalPoints;
            playersInLast.push(json._embedded.playerList[json._embedded.playerList.length - 1].name);

            for (i = 1; i < json._embedded.playerList.length; i++) {
                var currentIndex = json._embedded.playerList.length - (i + 1);
                if (json._embedded.playerList[currentIndex].totalPoints == lastPlacePoints) {
                    playersInLast.push(json._embedded.playerList[currentIndex].name);
                } else {
                    break;
                }
            }

            console.log('Players in last = ' + playersInLast);

            // Store the player in last for later pages
//                var playerInLast = json._embedded.playerList[json._embedded.playerList.length-1].name
            sessionStorage.setItem("playerInLast", JSON.stringify(playersInLast));

            if (!noPoints) {
                var playerInFirstHeader = $('<h3>');
                playerInFirstHeader.append('<span style="font-weight: bold;">1st</span>' + ': ' + playersInFirst);
                playerInFirstHeader.append('</h3>');
                $('#player-in-first-header').append(playerInFirstHeader);

                var playerInLastHeader = $('<h3>');
                playerInLastHeader.append('<span style="font-weight: bold;">Bonus</span>' + ': ' + playersInLast);
                playerInLastHeader.append('</h3>');
                $('#player-in-last-header').append(playerInLastHeader);
            }
    });
}

function displayGame() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    console.log('All params = ' + urlParams.toString());
    const seasonId = urlParams.get('seasonId');
    const players = urlParams.get('playerList');
    console.log('Season ID = ' + seasonId);
    console.log('Players = ' + players);

    var url = "http://league-tracker-rest-api-java-2.mybluemix.net/games?" + urlParams.toString();
    console.log('Getting a new game from = ' + url);

    // Get a new game
    $.getJSON(url,
       function (json) {
           console.log('JSON returned = ' + json);

           // Save the game in the current session
           // Put the object into storage
           sessionStorage.setItem('currentGame', JSON.stringify(json));

           // Display the tables of players, by looping through the table object
           for (i = 0; i < json.tables.length; i++) {
                var tablesText = $('<h2>');
                tablesText.append('<span style="font-weight: bold;">Table ' + (i+1) + '</span>' + ': ' + json.tables[i].players.toString());
                tablesText.append('</h2>');
                $('#table-header').append(tablesText);
           }

           // Display non-bonus achievement images (last achievement is bonus achievement)
           for (i = 0; i < json.achievements.length-1; i++) {
               var image = $('<div class="col-lg-4 col-md-4 col-xs-4 thumb">');
               image.append('<a class="thumbnail" href="#">');
               image.append('<image class="img-fluid" src="images/' + json.achievements[i].name + '.png">');
               image.append('</a>');
               image.append('</div>');
               $('#achievements-row').append(image);
           }

           // Display the bonus achievement image
           var numberOfImages = json.achievements.length;
           var image = $('<div class="col-lg-12 col-md-12 col-xs-12 thumb">');
           image.append('<a class="thumbnail" href="#">');
           image.append('<image class="img-fluid" src="images/' + json.achievements[numberOfImages-1].name + '.png">');
           image.append('</a>');
           image.append('</div>');
           $('#bonus-achievement-row').append(image);

           postAchievementsToSlack();

            ////// DISPLAY ALL ACHIEVEMENTS BIG WITH BONUS ON NEXT LINE //////
//            // Display achievement images (last achievement is bonus achievement)
//            for (i = 0; i < json.achievements.length-1; i++) {
//                var image = $('<div class="col-lg-4 col-md-4 col-xs-4 thumb">');
//                image.append('<a class="thumbnail" href="#">');
//                image.append('<image class="img-fluid" src="images/' + json.achievements[i].name + '.png">');
//                image.append('</a>');
//                image.append('</div>');
//                $('#achievements-row').append(image);
//            }
//
//            // Display the bonus achievement image
//            var numberOfImages = json.achievements.length;
//            var image = $('<div class="col-lg-4 col-md-4 col-xs-4 thumb">');
//            image.append('<a class="thumbnail" href="#">');
//            image.append('<image class="img-fluid" src="images/' + json.achievements[numberOfImages-1].name + '.png">');
//            image.append('</a>');
//            image.append('</div>');
//            $('#bonus-achievement-row').append(image);
       });
}