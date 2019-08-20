
function timestamp2date(timestamp) {
    var d = new Date(timestamp);
    var date = (d.getFullYear()) + "-" +
        (d.getMonth() + 1) + "-" +
        (d.getDate()) + " " +
        (d.getHours()) + ":" +
        (d.getMinutes()) + ":" +
        (d.getSeconds());
    return date;
}
exports.timestamp2date = timestamp2date;