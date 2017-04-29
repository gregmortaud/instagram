var cheerio = require("cheerio");
var request = require("request");
var async = require("async");
var waterfall = require('async-waterfall');
// var fs = require("fs");

var logger = function (level, message)
{
	level = (level || "") + "";
	message = (message || "") + "";

	console.log('{"level":"' + level.toUpperCase() + '", "site": "Leroy Merlin", "message": "' + message + '"}');
};

// function loadPage(searchLinkUrl, result, callback) {
// 	logger("info", "Connection to instagram HomePage");
// 	request({
// 	    headers: {
// 				'accept-encoding': 'gzip, deflate, sdch, br',
// 		    'accept-language': 'en-US,en;q=0.8,fr;q=0.6,de;q=0.4',
// 		    'upgrade-insecure-requests': '1',
// 		    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
// 		    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
// 		    'cache-control': 'max-age=0',
// 		    'authority': 'www.instagram.com'
// 	    },
// 			url: 'https://www.instagram.com/gregoireworldwide/?hl=en',
// 			'gzip': true,
// 	  }, function (error, response, body) {
// 	    if (!error && response.statusCode == 200) {
// 				var $ = cheerio.load(body);
// 				// console.log(body);
// 				console.log($("script")[2].children[0].data);
// 				// var $2 = cheerio.load($("script")[2].children[0].data);
// 				// console.log($2);
// 				return ;
// 				callback(result);
// 				return ;
// 			}
// 	  });
// };

var options = {
	error: null
};

function loadPage(urlCrawl, callback) {
  var $ = null;
  var isLoaded = false;
	var numberOfWhile = 0;

	setTimeout(function() {
		async.whilst(
			function () { return isLoaded == false; },
			function (callbackIsLoaded) {
				request(urlCrawl, function (error, response, body) {
					if (error || response.statusCode != 200) {
						numberOfWhile ++;
						if (numberOfWhile == 1) {
							logger("INFO", "request reloading...");
							callbackIsLoaded();
							return ;
						}
						if (numberOfWhile > 5) {
							logger("error", "---- Page failed to Request ----");
							options.error = "Page failed to request";
							callback($);
							return ;
						}
						callbackIsLoaded();
						return ;
					}
          $ = cheerio.load(body);
          isLoaded = true;
          callbackIsLoaded();
          return ;
				});
			},
			function () {
				callback($);
				return ;
			}
		);
	}, 100);
}

var crawl = function(cb)
{
	var username = null;
	if (process.argv.length < 3) {
		logger("error", "username needed");
		cb();
		return ;
	}
	else {
		username = process.argv[2];
	}
	var url = "https://www.instagram.com/"+username+"/?hl=en";
	loadPage(url, function($) {
		if (options.error) {
			logger("error", options.error);
			cb();
			return ;
		}
		console.log("done");
		cb();
		return ;
	});
};

exports.crawl = crawl;

crawl(function ()
{
	console.log("--------------------------Crawler in development-----------------------------");
});
