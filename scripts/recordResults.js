$(document).ready(function () {
    createTabHeadersAndTabPanes();
    populateTabs();
    setUpFormSubmit();
});

/**
* Fill in the table tabs with the results forms
*/
function populateTabs() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Retrieve stored game information
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    for (tableIndex = 0; tableIndex < gameJSON.tables.length; tableIndex++) {
        var tableNumber = tableIndex + 1;
        console.log('loop');
        console.log('number of tables = ' + gameJSON.tables.length)
        drawWinnersForms(tableNumber, gameJSON.tables[tableIndex].players);
        drawAchievementWinnersForms(tableNumber, gameJSON.tables[tableIndex].players);
        console.log('table index = ' + tableIndex);
    }
}

/**
* Create the headers for the tabs for the different tables and the content panes for those tabs
*/
function createTabHeadersAndTabPanes() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Retrieve stored game information
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    var tabHeaders = $('#tab-headers');
    var tabContent = $('#myTabContent');

    // For each table, create a new tab for that table and a new tab pane in the tab content section
    for (i = 0; i < gameJSON.tables.length; i++) {

        // Create the new tab
        var navItem = $('<li class="nav-item"></li>');
        if (i == 0) { // Only the first nav link should be active
            navItem.append('<a class="nav-link active" data-toggle="tab" href="#tab-pane-table' + (i+1) + '">Table ' + (i+1) + '</a>');
        } else {
            navItem.append('<a class="nav-link" data-toggle="tab" href="#tab-pane-table' + (i+1) + '">Table ' + (i+1) + '</a>');
        }
        tabHeaders.append(navItem);

        // Create the new tab pane
        if (i == 0) { // Only the first tab pane should be active
            var tabPane = $('<div class="tab-pane fade show active" id="tab-pane-table' + (i+1) + '"></div>');
        } else {
            var tabPane = $('<div class="tab-pane fade" id="tab-pane-table' + (i+1) + '"></div>');
        }
        tabPane.append('<br>');
        tabContent.append(tabPane);
    }
}

function selectize() {
    $('#selectize-test').selectize({
        maxItems: 2,
        placeholder: "Enter the second place finisher(s)",
    });

    $('#table-1-second').selectize({
        maxItems: 2,
        placeholder: "Enter the second place finisher(s)",
        closeAfterSelect: true
    });
}

/**
* Captures the submit event and stops it, building the game result payload for the backend and submitting it
*/
function setUpFormSubmit() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Retrieve stored game information
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    var form = $('#hidden-form');
    $(form).submit(function( event ) {
        console.log( $( this ).serializeArray() );
        event.preventDefault();

        var seasonIdJSON = '{"seasonId":' + seasonId + ",";
        var tableResults = '"tableResults": [';

        for (tableNumber = 1; tableNumber < gameJSON.tables.length+1; tableNumber++) {
            var winnersForms = $('.winners-form' + tableNumber);
            var winnersJson = '{"winner": "' + winnersForms[0].selectedOptions[0].text;
            winnersJson = winnersJson + '",';
            console.log('Winners json = ' + winnersJson);

            var secondersForms = $('.seconders-form' + tableNumber);
            var secondersJson = '"seconders": [';
            for (i = 0; i < secondersForms[0].selectedOptions.length; i++) {
                secondersJson = secondersJson + '"' + secondersForms[0].selectedOptions[i].text + '"';
                if (i != secondersForms[0].selectedOptions.length - 1) {
                    secondersJson = secondersJson + ',';
                }
            }
            secondersJson = secondersJson + '],';
            console.log('Seconders json = ' + secondersJson);

            var achievementForms = $('.achievement-form' + tableNumber);
            var achievementsJSON = '"achievementWinners": {';
            for (i = 0; i < achievementForms.length; i++) {
                achievementsJSON = achievementsJSON + '"' + gameJSON.achievements[i].name + '":"' + achievementForms[i].elements[0].selectedOptions[0].text + '"';
                if (i != achievementForms.length - 1) {
                    achievementsJSON = achievementsJSON + ',';
                }
            }
            achievementsJSON = achievementsJSON + '},';
            console.log('Achievements json = ' + achievementsJSON);

            var participantsJSON = '"participants":[';
            for (j = 0; j < gameJSON.tables[tableNumber-1].players.length; j++) {
                if (j == gameJSON.tables[tableNumber-1].players.length - 1) { // Last one
                    participantsJSON += '"' + gameJSON.tables[tableNumber-1].players[j] + '"]';
                } else {
                    participantsJSON += '"' + gameJSON.tables[tableNumber-1].players[j] + '",';
                }
            }

            // If this is the last table, close the JSON payload
            if (tableNumber == gameJSON.tables.length) {
                participantsJSON += '}]}';
            } else {
                participantsJSON += '},';
            }
            console.log('Participants JSON = ' + participantsJSON);

            tableResults += winnersJson + secondersJson + achievementsJSON + participantsJSON
        }

        var resultsJSON = seasonIdJSON + tableResults;
        console.log('Results json = ' + resultsJSON);

        // Send the JSON payload to the backend
        $.ajax({
          type: 'POST',
          beforeSend: function(request) {
              request.setRequestHeader("Content-type", "application/json");
          },
          url: $(form).attr('action'),
          data: resultsJSON
        }).done(function(response) {
            console.log('Successfully  POSTed results');
            window.location.href="mainMenu.html?seasonId=" + seasonId;
        }).fail(function(data) {
            console.log('Failed to POST results: ' + data);
        });
    });
}

/**
* Triggers the submit event to submit the results
*/
function submitGameResults() {
    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Get the form.
    var hiddenForm = $('#hidden-form');
    $(hiddenForm).submit();
}

function drawAchievementWinnersForms(tableNumber, players) {
    // Retrieve the stored game and stored player in first and last
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);
    var playerInFirst = JSON.parse(sessionStorage.getItem('playerInFirst'));
    var playerInLast = JSON.parse(sessionStorage.getItem('playerInLast'));
    console.log('Player in last = ' + playerInLast);

    // Check for edge case where all players have 0 points
    var pointsSum = 0;
    for (i = 0; i < gameJSON.tables.length; i++) {
        for (j = 0; j < gameJSON.tables[i].length; j++) {
            pointsSum += gameJSON.tables[i].players[j].totalPoints;
        }
    }
    if (pointsSum == 0) {
        noPoints = true;
    }

    // Build the achievement winner forms (non-bonus achievements)
    var achievementWinnersFormRow = $('<div class="row" id="achievement-winners-form-row"></div>');
    for (i = 0; i < gameJSON.achievements.length; i++) {
        var columnWidth = $('<div class="col-md-3"></div>');
        var figure = $('<figure class="figure"></figure>');
        var image = $('<img src="images/' + gameJSON.achievements[i].name + '.png" class="figure-img img-fluid rounded">');
        var caption = $('<figcaption class="figure-caption"></figcaption>');
        var form = $('<form class="achievement-form' + tableNumber + '"></form>');
        var formGroup = $('<div class="form-group"></div>');
        var selectForm = $('<select class="form-control"></select>');

        // Add the none option to the drop down list
        selectForm.append('<option>none</option>');

        // If this is the bonus achievement
        if (i == gameJSON.achievements.length-1) {
            for (lastPlayerIndex = 0; lastPlayerIndex < playerInLast.length; lastPlayerIndex++) {
                if (players.indexOf(playerInLast[lastPlayerIndex]) > -1) {
                    selectForm.append('<option>' + playerInLast[lastPlayerIndex] + '</option>');
                    console.log('playerInLast[lastPlayerIndex] = ' + playerInLast[lastPlayerIndex]);
                    console.log('playerInLast.length = ' + playerInLast.length);
                }

            }
        } else {
            if (noPoints) {
                for (k = 0; k < players.length; k++) {
                    selectForm.append('<option>' + players[k] + '</option>');
                }
            } else {
                // If not bonus achievement, add all players who are not in first place
                for (k = 0; k < players.length; k++) {
                    if (playerInFirst.indexOf(players[k]) < 0 && noPoints) {
                        selectForm.append('<option>' + players[k] + '</option>');
                    }
                }
            }
        }

        formGroup.append(selectForm);
        form.append(formGroup);
        caption.append(form);
        figure.append(image);
        figure.append(caption);
        columnWidth.append(figure);

        achievementWinnersFormRow.append(columnWidth);

        $('#tab-pane-table' + tableNumber).append(achievementWinnersFormRow);
    }
}

function drawWinnersForms(tableNumber, players) {
    // Retrieve the stored game
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    // Build the winners and seconders forms
    var resultsRow = $('<div class="row"></div>');
    var columnWidth = $('<div class="col-md-6"></div>');
    var form = $('<form class="winners-form' + tableNumber + '"></form>');
    var formGroup = $('<div class="form-group"></div>');
    var formLabel = $('<label class="form-label" for="table-' + tableNumber + '-winner">Table ' + tableNumber + ' Winner</label>');
    var selectForm = $('<select class="winners-form' + tableNumber + '" id="table-' + tableNumber + '-winner"></select>');
    var selectForm2 = $('<select class="seconders-form' + tableNumber + '" id="table-' + tableNumber + '-second"></select>');

    selectForm.append('<option></option>');
    selectForm2.append('<option></option>');
    for (j = 0; j < players.length; j++) {
        selectForm.append('<option>' + players[j] + '</option>');
        selectForm2.append('<option>' + players[j] + '</option>');
    }

    columnWidth.append(formLabel);
    columnWidth.append(selectForm);
    resultsRow.append(columnWidth);

    var columnWidth2 = $('<div class="col-md-6"></div>');
    var formLabel2 = $('<label class="form-label" for="table-' + tableNumber+ '-second">Table ' + tableNumber + ' Second Place Players</label>');

    columnWidth2.append(formLabel2);
    columnWidth2.append(selectForm2);
    resultsRow.append(columnWidth2);
    $('#tab-pane-table' + tableNumber).append(resultsRow);
    $('#tab-pane-table' + tableNumber).append('<br><br>');

    // Selectize the options for the first place table
    $('#table-' + tableNumber + '-winner').selectize({
                maxItems: 1,
                placeholder: "",
                closeAfterSelect: true
    });

    // Selectize the options for the second place table
    $('#table-' + tableNumber + '-second').selectize({
                maxItems: gameJSON.tables[tableNumber-1].players.length-1,
                placeholder: "",
                closeAfterSelect: true
    });
}