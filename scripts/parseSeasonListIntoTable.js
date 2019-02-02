$(document).ready(function () {
    parseSeasonListIntoTable();
});

function makeTablesClickable() {
    console.log('MAKING IT CLICKABLE');
    $('.table > tbody > tr').click(function() {
        window.location = $(this).data("href");
    });
}

function parseSeasonListIntoTable() {
    $.getJSON("http://localhost:8080/seasons",
        function (json) {
            var tbody;
            tbody = $('<tbody>');
            for (var i = 0; i < json._embedded.seasonList.length; i++) {
                var tr;
                if (i % 2 == 0) {
                    tr = $('<tr data-href="mainMenu.html?seasonId=' + json._embedded.seasonList[i].id + '">');
                } else {
                    tr = $('<tr class="table-secondary" data-href="mainMenu.html?seasonId=' + json._embedded.seasonList[i].id + '">');
                }
                tr.append('<th scope="row">' + json._embedded.seasonList[i].name + '</th>');
                tr.append("<td>" + json._embedded.seasonList[i].id + "</td>");
                tr.append("</tr>");
                console.log(tr);
                tbody.append(tr);
    //            $('#seasonTable').append(tbody);
            }
            tbody.append('</tbody>');
            $('#seasonTable').append(tbody);
            console.log(json);
            console.log("NIIIIIICE");

            makeTablesClickable();
        });
}
