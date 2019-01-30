$(document).ready(function () {
    drawWinnersForms();
    drawAchievementWinnersForms();
    testFormSubmit();
//    submitGameResults();
});

function testFormSubmit() {
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

      console.log('Test form submitted');
//      var formData = $(form).serializeArray();
//      console.log('Test form data ' + formData);
//
//      var selectData = $('#test-select');
//
//      console.log('Select value = ' + selectData.val());
//
//      var formControls = $('.form-control');
//      console.log('Number of form controls = ' + formControls.length);

      var seasonIdJSON = '{"seasonId":' + seasonId + ",";

      var winnersForms = $('.winners-form');
      console.log('Number of winners forms = ' + winnersForms.length);
      console.log('Winners form[0] = ' + winnersForms[0].elements[0].selectedOptions[0].text);

      var winnersJson = '"winners": [';
      for (i = 0; i < winnersForms.length; i++) {
        winnersJson = winnersJson + '"' + winnersForms[i].elements[0].selectedOptions[0].text + '"';
        if (i != winnersForms.length - 1) {
            winnersJson = winnersJson + ',';
        }
      }
      winnersJson = winnersJson + '],';

      console.log('Winners json = ' + winnersJson);

    var secondersForms = $('.seconders-form');
    var secondersJson = '"seconders": [';
    for (i = 0; i < secondersForms.length; i++) {
      secondersJson = secondersJson + '"' + secondersForms[i].elements[0].selectedOptions[0].text + '"';
      if (i != secondersForms.length - 1) {
          secondersJson = secondersJson + ',';
      }
    }
    secondersJson = secondersJson + '],';

    console.log('Seconders json = ' + secondersJson);

    var achievementForms = $('.achievement-form');
    var achievementsJSON = '"achievementWinners": {';
    for (i = 0; i < achievementForms.length; i++) {
      achievementsJSON = achievementsJSON + '"' + gameJSON.achievements[i].name + '":"' + achievementForms[i].elements[0].selectedOptions[0].text + '"';
      if (i != achievementForms.length - 1) {
          achievementsJSON = achievementsJSON + ',';
      }
    }
    achievementsJSON = achievementsJSON + '},';
    console.log('Achievements json = ' + achievementsJSON);

    console.log('Length of tables = ' + gameJSON.tables.length);
    var participantsJSON = '"participants":[';
    for (i = 0; i < gameJSON.tables.length; i++) {
        console.log('First for loop');
        console.log('Number of players at table = ' + gameJSON.tables[i].length);
        for (j = 0; j < gameJSON.tables[i].players.length; j++) {
            console.log('Second for loop');
            if (i == gameJSON.tables.length - 1 && j == gameJSON.tables[i].players.length - 1) { // Last one
                participantsJSON += '"' + gameJSON.tables[i].players[j] + '"]';
            } else {
                participantsJSON += '"' + gameJSON.tables[i].players[j] + '",';
            }
        }
    }
    participantsJSON += '}';
    console.log('Participants JSON = ' + participantsJSON);

      var resultsJSON = seasonIdJSON + winnersJson + secondersJson + achievementsJSON + participantsJSON;
      console.log('Results json = ' + resultsJSON);

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
            // Make sure that the formMessages div has the 'success' class.
//            $(formMessages).removeClass('error');
//            $(formMessages).addClass('success');
//
//            // Set the message text.
//            $(formMessages).text(response);
        }).fail(function(data) {
            console.log('Failed to POST results: ' + data);
              // Make sure that the formMessages div has the 'error' class.
//              $(formMessages).removeClass('success');
//              $(formMessages).addClass('error');
//
//              // Set the message text.
//              if (data.responseText !== '') {
//                  $(formMessages).text(data.responseText);
//              } else {
//                  $(formMessages).text('Oops! An error occured and your message could not be sent.');
//              }
          });
    });

}
function submitGameResults() {

    // Get season ID and players
    const urlParams = new URLSearchParams(window.location.search);
    const seasonId = urlParams.get('seasonId');

    // Get the form.
    var hiddenForm = $('#hidden-form');
    $(hiddenForm).submit();
//    window.location.href="mainMenu.html?seasonId=" + seasonId;
//    var form = $('.winners-form');
//    var form2 = $('#test-form');
//
//
//    console.log('Forms: ' + form[0]);
//    console.log('Form2: ' + $(form2));
//    var form2data = $(form2).serialize();
//    console.log(form2data)
//
//    $(form2).submit();
//
//    // Get the messages div.
//    var formMessages = $('#form-messages');
//
    // Set up an event listener for the contact form.
//    $(form).submit(function(event) {
//        // Stop the browser from submitting the form.
//        event.preventDefault();

//        var updatedForm = $('.winners-form');
//        var formData = $(form).serializeArray();
//        console.log(formData);
//
//        var json = '{';
//        for (i = 0; i < formData.length; i++) {
//            if (i == 0) { // First element
//                json = json + '"name":' + '"' + formData[i]['value'] + '"';
//                json = json + ', "players":[';
//            } else if (i == formData.length-1) { // Last element
//                json =  json + '{"name":"' + formData[i]['value'] + '"' + ', "totalPoints":0}' + ']}';
//            } else {
//                json = json + '{"name":"' + formData[i]['value'] + '"' + ', "totalPoints":0}' + ',';
//            }
//        }
//        console.log('JSON: ' + json);
//
//        // Submit the form using AJAX.
//        $.ajax({
//            type: 'POST',
//            beforeSend: function(request) {
//                request.setRequestHeader("Content-type", "application/json");
//            },
//            url: $(form).attr('action'),
//            data: json
//        }).done(function(response) {
//              // Make sure that the formMessages div has the 'success' class.
//              $(formMessages).removeClass('error');
//              $(formMessages).addClass('success');
//
//              // Set the message text.
//              $(formMessages).text(response);
//          }).fail(function(data) {
//                // Make sure that the formMessages div has the 'error' class.
//                $(formMessages).removeClass('success');
//                $(formMessages).addClass('error');
//
//                // Set the message text.
//                if (data.responseText !== '') {
//                    $(formMessages).text(data.responseText);
//                } else {
//                    $(formMessages).text('Oops! An error occured and your message could not be sent.');
//                }
//            });
//            window.location.href="mainMenu.html?seasonId=5";
//        });
}

function drawAchievementWinnersForms() {
// Building the object below
//          <div class="col-md-3">
//                <figure class="figure">
//                    <img src="images/yaBasic.png" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
//                    <figcaption class="figure-caption">
//                        <form>
//                            <div class="form-group">
//                                <!--<label for="exampleSelect2">Example select</label>-->
//                                <select class="form-control" id="exampleSelect11">
//                                    <option>1</option>
//                                    <option>2</option>
//                                    <option>3</option>
//                                    <option>4</option>
//                                    <option>5</option>
//                                </select>
//                            </div>
//                        </form>
//                    </figcaption>
//                </figure>
//            </div>

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
//            console.log('Player = ' + gameJSON._embedded.playerList[i].name + ' points = ' + gameJSON._embedded.playerList[i].totalPoints);
            pointsSum += gameJSON.tables[i].players[j].totalPoints;
        }
    }
    if (pointsSum == 0) {
        noPoints = true;
    }

    // Build the achievement winner forms (non-bonus achievements)
    for (i = 0; i < gameJSON.achievements.length; i++) {
        var columnWidth = $('<div class="col-md-3"></div>');
        var figure = $('<figure class="figure"></figure>');
        var image = $('<img src="images/' + gameJSON.achievements[i].name + '.png" class="figure-img img-fluid rounded">');
        var caption = $('<figcaption class="figure-caption"></figcaption>');
        var form = $('<form class="achievement-form"></form>');
        var formGroup = $('<div class="form-group"></div>');
        var selectForm = $('<select class="form-control"></select>');

        // Add the none option to the drop down list
        selectForm.append('<option>none</option>');

        // If this is the bonus achievement
        if (i == gameJSON.achievements.length-1) {
            for (lastPlayerIndex = 0; lastPlayerIndex < playerInLast.length; lastPlayerIndex++) {
                selectForm.append('<option>' + playerInLast[lastPlayerIndex] + '</option>');
                console.log('playerInLast[lastPlayerIndex] = ' + playerInLast[lastPlayerIndex]);
                console.log('playerInLast.length = ' + playerInLast.length);

            }
        } else {
            if (noPoints) {
                console.log('No points');
                for (j = 0; j < gameJSON.tables.length; j++) {
                    for (k = 0; k < gameJSON.tables[j].players.length; k++) {
                            selectForm.append('<option>' + gameJSON.tables[j].players[k] + '</option>');
                    }
                }
            } else {
                  // If not bonus achievement, add all players who are not in first place
                for (j = 0; j < gameJSON.tables.length; j++) {
                    for (k = 0; k < gameJSON.tables[j].players.length; k++) {
                        if (playerInFirst.indexOf(gameJSON.tables[j].players[k]) < 0 && noPoints) {
                            selectForm.append('<option>' + gameJSON.tables[j].players[k] + '</option>');
                        }
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

        $('#achievement-winners-form-row').append(columnWidth);
    }
}

function drawWinnersForms() {
// Building the object below
//      <div class="row" id="winners-form"></div>
//            <div class="col-md-6">
//                <form>
//                    <div class="form-group">
//                        <label for="table-winner-1">Example select</label>
//                        <select class="form-control" id="table-winner-1">
//                            <option>1</option>
//                            <option>2</option>
//                            <option>3</option>
//                            <option>4</option>
//                            <option>5</option>
//                        </select>
//                    </div>
//                </form>
//            </div>
//            <div class="col-md-6">
//                <form>
//                    <div class="form-group">
//                        <label for="table-second-1">Example select</label>
//                        <select class="form-control" id="table-second-1">
//                            <option>1</option>
//                            <option>2</option>
//                            <option>3</option>
//                            <option>4</option>
//                            <option>5</option>
//                        </select>
//                    </div>
//                </form>
//            </div>
//        </div>
    // Retrieve the stored game
    var gameJSONString = sessionStorage.getItem('currentGame');
    var gameJSON = JSON.parse(gameJSONString);

    // Build the winners and seconders forms
    for (i = 0; i < gameJSON.tables.length; i++) {
        var resultsRow = $('<div class="row"></div>');
        var columnWidth = $('<div class="col-md-6"></div>');
        var form = $('<form class="winners-form"></form>');
        var formGroup = $('<div class="form-group"></div>');
        var formLabel = $('<label for="table-' + (i+1) + '-winner">Table ' + (i+1) + ' Winner</label>');
        var selectForm = $('<select class="form-control" id="table-' + (i+1) + '-winner"></select>');
        var selectForm2 = $('<select class="form-control" id="table-' + (i+1) + '-second"></select>');

        for (j = 0; j < gameJSON.tables[i].players.length; j++) {
            selectForm.append('<option>' + gameJSON.tables[i].players[j] + '</option>');
            selectForm2.append('<option>' + gameJSON.tables[i].players[j] + '</option>');
        }

        formGroup.append(formLabel);
        formGroup.append(selectForm);
        form.append(formGroup);
        columnWidth.append(form);
        resultsRow.append(columnWidth);

        var columnWidth2 = $('<div class="col-md-6"></div>');
        var form2 = $('<form class="seconders-form"></form>');
        var formGroup2 = $('<div class="form-group"></div>');
        var formLabel2 = $('<label for="table-' + (i+1) + '-second">Table ' + (i+1) + ' Second Place</label>');

        formGroup2.append(formLabel2);
        formGroup2.append(selectForm2);
        form2.append(formGroup2);
        columnWidth2.append(form2);
        resultsRow.append(columnWidth2);

        $('#winners-form-container').append(resultsRow);
        $('#winners-form-container').append('<br>');
    }
}