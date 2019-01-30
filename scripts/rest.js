function get(urlPath, onCompleteFunction) {
    $.ajax({
        url: urlPath
    }).then(function(data, status, jqxhr) {
        console.log('Get returned: ' + data);
        onCompleteFunction();
    });
}