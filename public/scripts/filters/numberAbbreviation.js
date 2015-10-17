angular.module("numberAbbreviation", [])
.filter('abbreviate', ['$filter', function (filter) {
    return function (num, numFixed) {
        if (typeof(numFixed) != 'number') {
            numFixed = 3;
        }

        num = parseInt(num, 10);

        if (typeof(num) != 'number') {
            return 0;
        }
        var suffixes = ['', 'k', 'm', 'b', 't'];
        var steps = 0;
        var testnum = num;
        while (testnum > 1) {
            testnum = testnum / 1000;
            steps++;
        }
        num = (testnum * 1000).toFixed(numFixed);
        if (suffixes[steps-1]) {
            num = num + ' ' + suffixes[steps-1]
        }
        return num;
    }
}])