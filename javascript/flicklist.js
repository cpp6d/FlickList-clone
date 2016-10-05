var model = {
  watchlistItems: [],
  browseItems: [],
  // DONE
  // add a new field, browseActiveIndex, initially set to 0
  browseActiveIndex: 0
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "8e888fa39ec243e662e1fb738c42ae99",
  imageBaseUrl: "http://image.tmdb.org/t/p/"
}


function discoverMovies(data, callback) {
  
  $.ajax({
    url: api.root + "/discover/movie",
    data: data,
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    },
    fail: function() {
      console.log("discover failed");
    }
  });
}


function searchMovies(query, callback) {
  fetchKeywords(
    query, 
    function(keywordsResponse) {
      console.log("fetch succeeded");
      var firstKeywordID = keywordsResponse.results[0].id
      var data = {
        api_key: api.token,
        with_keywords: firstKeywordID
      };
      discoverMovies(data, callback);
    },
    function() {
      console.log("fetchkeywords failed")
      var data = {
        api_key: api.token
      };
      discoverMovies(data, callback);
    }
  );
}


function fetchKeywords(query, cbSuccess, cbError) {
  // DONE
  $.ajax({
    url: api.root + "/search/keyword",
    data: {
      api_key: api.token,
      query: query
    },
    success: cbSuccess,
    error: cbError
  });
}


function render() {
  var watchlistElement = $("#section-watchlist ul");
  var carouselInner = $("#section-browse .carousel-inner");
  var browseInfo = $("#browse-info");

  // clear everything
  watchlistElement.empty();
  carouselInner.empty();
  browseInfo.empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {

    // panel heading
    var title = $("<h5></h5>").text(movie.original_title);  
    var panelHeading = $("<div></div>")
      .attr("class", "panel-heading")
      .append(title);

    // panel body
    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var panelBody = $("<div></div>")
      .attr("class", "panel-body")
      .append(poster)
      .append(button);

    // panel
    var panel = $("<div></div>")
      .attr("class", "panel panel-default")
      .append(panelHeading)
      .append(panelBody);


    var button = $("<button></button>")
      .text("I watched it")
      .attr("class", "btn")
      .click(function() {
        removeFromWatchlist(movie);
        render();
      })
      .hide();

    var itemView = $("<li></li>")
      .append(panel)
      .append(button)
      .mouseover(function() {
        button.show();
      })
      .mouseleave(function() {
        button.hide();
      });

    watchlistElement.append(itemView)
  });

  // insert browse items
  model.browseItems.forEach(function(movie, index) {

    var poster = $("<img></img>")
      .attr("src", posterUrl(movie, "w300"));
    var carouselItem = $("<div></div>")
      .attr("class", "item")
      .append(poster);
    
    carouselInner.append(carouselItem);

    if (index === model.browseActiveIndex) {
      carouselItem.attr("class", "item active");
    }

  });

  var activeMovie = model.browseItems[model.browseActiveIndex];
  var title = $("<h3></h3>").text(activeMovie.original_title);
  var overview = $("<p></p>").text(activeMovie.overview);
  browseInfo
    .append(title)
    .append($("<hr/>"))
    .append(overview);
  
  var alreadyOnWatchlist = model.watchlistItems.indexOf(activeMovie) !== -1
  $("#add-to-watchlist").prop("disabled", alreadyOnWatchlist);
}


function posterUrl(movie, width) {
  return api.imageBaseUrl + width + "/" + movie.poster_path;
}

function removeFromWatchlist(movie) {
  // DONE
  model.watchlistItems = model.watchlistItems.filter(function(item) {
    return item !== movie;
  });
}

function addActiveMovie() {
  // DONE
  var activeMovie = model.browseItems[model.browseActiveIndex];
  model.watchlistItems.push(activeMovie);
}