(function($, window){
	var restaurants = $("#RestaurantResults").find("a[rel^='VendorName']");

	if (restaurants.length === 0) {
		return;
	}	

	var auth = { 
	  consumerKey: "7BQorpwcEYvhcplPz7bPjA", 
	  consumerSecret: "Haj-cF4_gz3eYCP4k6AGWML8Vu8",
	  accessToken: "54nsx5KN1O6undGlE1qKUhrZPgdlYRQD",
	  accessTokenSecret: "Ym4Lt4sFZfh4zFXRixbfb56QKUE",
	  serviceProvider: { 
	    signatureMethod: "HMAC-SHA1"
	  }
	};

	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};

	restaurants.each(function(index, elem) {
		fetchYelpResult(elem);
	});

	function fetchYelpResult(elem){
		var title = $(elem).text().replace(/\(.*\)/,'').trim();
		var parameters = [];
		parameters.push(['term', title]);
		parameters.push(['location', "new york"]);
		parameters.push(['oauth_consumer_key', auth.consumerKey]);
		parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
		parameters.push(['oauth_token', auth.accessToken]);
		parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

		var message = { 
		  'action': 'http://api.yelp.com/v2/search',
		  'method': 'GET',
		  'parameters': parameters 
		};

		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);

		var parameterMap = OAuth.getParameterMap(message.parameters);
		parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

		$.ajax({
			'url': message.action,
			'data': parameterMap,
			'cache': true,
			'datatype': "jsonp",
			success: function(data, textStats, XMLHttpRequest) {
				displayResult(data, $(elem));
			}
		});
	}

 	function displayResult(results, $elem) {
		var bestMatch = results.businesses[0];
		if (bestMatch !== undefined) {
			var imageUrl = bestMatch.rating_img_url;
			var link = bestMatch.url;
			var ratingsHtml = "<br/>";
			ratingsHtml += "<a style='' target='_blank' href='" + link + "'>";
			ratingsHtml += "<img src='"+ imageUrl + "'";
			ratingsHtml += "</img>";
			ratingsHtml += "</a>"
		}z
		
		var ratingCell = $elem.closest("tr").find(".rating-count").closest("td");

		ratingCell.append(ratingsHtml);
	}

})(jQuery, window);