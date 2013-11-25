(function($, window){
	var restaurants = $("#RestaurantResults").find("a[rel^='VendorName']"),
		isCorp = false;

	if (restaurants.length === 0) {
		// For their corp website
		restaurants = $("#RestaurantListing").find("a[name = 'vendorLocation']");
		isCorp = true;
	}

	if (restaurants.length === 0) {
		alert("Sorry API is unable to find the restaurants on Seamless");
		return;
	}

	restaurants.each(function(index, elem) {
		fetchYelpResult(elem);
	});

	function fetchYelpResult(elem){
		var title = $(elem).text().replace(/\(.*\)/,'').trim(),
			// url = "http://localhost:5000/search",
			url = "http://yelpapi.herokuapp.com/search",
			parameters = {};

		parameters.q = title;
		parameters.l = "10041";

		$.ajax({
			'url': url,
			'data': parameters,
			'cache': true,
			'datatype': "jsonp",
			success: function(data, textStats, XMLHttpRequest) {
				displayResult(JSON.parse(data), $(elem));
			}
		});
	}

	function displayResult(results, $elem) {
		var bestMatch = JSON.parse(results[0]).businesses[0];
		if (bestMatch !== undefined) {
			var imageUrl = bestMatch.rating_img_url;
			var link = bestMatch.url;
			var ratingsHtml = "<br/>";
			ratingsHtml += "<a style='' target='_blank' href='" + link + "'>";
			ratingsHtml += "<img src='"+ imageUrl + "'";
			ratingsHtml += "</img>";
			ratingsHtml += "</a>"
		}

		var ratingCell;
		if (!isCorp){
			ratingCell = $elem.closest("tr").find(".rating-count").closest("td");
		}
		else {
			ratingCell = $elem.closest("tr").find(".rating");	
		}

		ratingCell.append(ratingsHtml);
	}

})(jQuery, window);
