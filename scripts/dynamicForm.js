var room = 3;
function addPlayerForm() {
    room++;
    var objTo = document.getElementById('player-form-list')
    var divtest = document.createElement("div");
	divtest.setAttribute("class", "form-group");
	var rdiv = 'removeclass'+room;
    divtest.innerHTML = '<p><input type="text" class="form-control" placeholder="The Puppet Master" required="required" data-error="Player name is required." name="players"></p>';

    objTo.appendChild(divtest)
}