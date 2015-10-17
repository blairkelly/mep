angular.module("timeFilters", [])
.filter('time_shortify', ['$filter', function (filter) {
    return function (date) {
        var get_rid_of_moment_fallback_warning = new Date(date);
        return moment(get_rid_of_moment_fallback_warning).format('MMM Do YYYY, hh:mm:ss');
    }
}])
.filter('twenty_four_hours', [function () {
    return function (date) {
        var get_rid_of_moment_fallback_warning = new Date(date);
        return moment(get_rid_of_moment_fallback_warning).format('HH:mm:ss');
    }
}])
.filter('date', [function () {
    return function (date) {
        var get_rid_of_moment_fallback_warning = new Date(date);
        return moment(get_rid_of_moment_fallback_warning).format('MMMM Do, YYYY');
    }
}])
.filter('diff_ago', [function () {
    return function (date, other_date, unit) {
        var get_rid_of_moment_fallback_warning = new Date(date);
        var od = new Date(other_date);
        var diff = moment(get_rid_of_moment_fallback_warning).diff(od, unit);
        return diff;
    }
}])