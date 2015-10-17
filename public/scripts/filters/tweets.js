angular.module("tweetFilters", [])
.filter('tweetDate', ['$filter', function (filter) {
    return function (date) {
        var get_rid_of_moment_fallback_warning = new Date(date);
        return moment(get_rid_of_moment_fallback_warning).format('MMMM Do YYYY,[ at ]h:mma');
    }
}])
.filter('tweetText', ['$filter', function (filter) {
    return function (tweet) {
        if (!tweet) {
            return null;
        }
        var tweet_text = tweet.text;
        if (typeof(tweet.entities) == 'string') {
            tweet.entities = JSON.parse(tweet.entities);
        }
        var entities = tweet.entities;
        if (entities.urls.length > 0) {
            entities.urls.forEach(function (url) {
                tweet_text = tweet.text.substring(0, url.indices[0]) + '<a target="_blank" href="' + url.expanded_url + '">' + url.display_url + '</a>' + tweet.text.substring(url.indices[1]);
            });
        }
        return tweet_text;
    }
}]);