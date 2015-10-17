requiredModules = []

//library
requiredModules.push(
    'ngSanitize'
);

//controllers
requiredModules.push(
    'controlController'
);

//directives
requiredModules.push(
    'bkTouch'
);

//filters
requiredModules.push(
    'numberAbbreviation',
    'timeFilters',
    'tweetFilters'
);
//services
requiredModules.push(
    'controlService'
);

mepApp = window.mepApp = angular.module('mepApp', requiredModules)