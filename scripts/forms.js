$(document).ready(function() {
     // Get the form.
    var form = $('#season-form');

    // Get the messages div.
    var formMessages = $('#form-messages');

    // Set up an event listener for the contact form.
    $(form).submit(function(event) {
        // Stop the browser from submitting the form.
        event.preventDefault();

        var updatedForm = $('#season-form');
        var formData = $(updatedForm).serializeArray();
        console.log(formData);

        var json = '{';
        for (i = 0; i < formData.length; i++) {
            if (i == 0) { // First element
                json = json + '"name":' + '"' + formData[i]['value'] + '"';
                json = json + ', "players":[';
            } else if (i == formData.length-1) { // Last element
                json =  json + '{"name":"' + formData[i]['value'] + '"' + ', "totalPoints":0}' + ']}';
            } else {
                json = json + '{"name":"' + formData[i]['value'] + '"' + ', "totalPoints":0}' + ',';
            }
        }
        console.log('JSON: ' + json);

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            beforeSend: function(request) {
                request.setRequestHeader("Content-type", "application/json");
            },
            url: $(form).attr('action'),
            data: json
        }).done(function(response) {
                console.log('Response = ' + response.id);
              // Make sure that the formMessages div has the 'success' class.
              $(formMessages).removeClass('error');
              $(formMessages).addClass('success');

              window.location.href="mainMenu.html?seasonId=" + response.id;

              // Set the message text.
//              $(formMessages).text(response);
          }).fail(function(data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');

                // Set the message text.
                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text('Oops! An error occured and your message could not be sent.');
                }
            });
//            window.location.href="mainMenu.html?seasonId=5";
        });
});