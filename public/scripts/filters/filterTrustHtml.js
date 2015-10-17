angular.module("filterTrustHtml", [])
.filter('trustHtml', ['$filter', '$sce', function (filter, sce) {
    return function (html) {
        if (!html) {
            return;
        }
        return sce.trustAsHtml(html);
    }
}])