
function goToUserManual() {
    window.location = "/user_manual/list.html"
}

function goToDbMapper() {
    window.location = "/db_mapper/db_mapper.html"
}

$(function () {
    $("#software_title_display").text(softwareName);
    if (softwareName.toLowerCase() === "qanty"){
        $("#go_to_dbmapper_button").show();
    }
});
