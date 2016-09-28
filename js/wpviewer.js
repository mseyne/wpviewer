var searchValue = '';
var resultJSON;
var numbResult = 10;

function displaySearchBar(){
    $('#mainNavbar').addClass('hide');
    $('nav form').removeClass('hide');
    $('#search').focus();
}

function hideSearchBar(){
    $('nav form').addClass('hide');
    $('#mainNavbar').removeClass('hide');
}

var getWikipediaResults = function(val){
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + val + '&limit=' + numbResult + '&suggest=1&redirects=return&callback=ttt',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function( data ) {
            resultJSON = data;
            createResultsCards();
        }
    });
}

var createResultsCards = function(){
    $('#results').html('').show();
    $('#searchTitle').html(resultJSON[0]);
    var article = [];
    for (var i = 0; i < numbResult; i++){
        for (var content of resultJSON){
            if(content !== resultJSON[0]){
                article.push(content[i]);
            }
        }
        displayResultCard(article);
        article = [];
    }
}

var displayResultCard = function(article){
    var newCard = '<div class="divider"></div><a href="' + article[2] + '" target="_blank">';
    newCard += '<article class="card-panel result-card hoverable amber lighten-4 z-depth-1">';
    newCard += '<span class="title orange-text text-darken-4">' + article[0] + '</span> : '
    newCard += '<span class="description grey-text text-darken-3">' + article[1] + '</span></article></a>'
    $('#results').append(newCard);
}


var getWikipediaRandom = function(){
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&" +
    "prop=revisions|images|extracts&exchars=250&callback=?&format=json", 
        function(data) {
        resultJSON = data;
        createRandomCard();
    });
}

var createRandomCard = function(){
    $('#randomCard').html('');
    // console.log(resultJSON.query.pages);
    for ( var data in resultJSON.query.pages){
        var array = resultJSON.query.pages[data];
        var title = array.title;
        var extract = array.extract;
        var image = array.images[0].title;
        var link = "https://en.wikipedia.org/wiki/" + title;
    }
    displayRandomCard(title, extract, image, link)
}

var displayRandomCard = function(title, extract, image, link){
    var newCard = '<div class="card-image"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Fox_study_6.jpg/159px-Fox_study_6.jpg"></div>'
    + '<div class="card-stacked"><div class="card-content"><div class="center-align"><h5 class="orange-text"> ' + title + ' </h5></div>'
    + extract + '</div><div class="card-action"><a href="' + link + '">' + title + '</a></div></div>';
    $('#randomCard').append(newCard);
}

$('document').ready(function(){

    $('#searchWP').on('click', function(){
        displaySearchBar();
    });

    $('#closeSearch').on('click', function(){
        hideSearchBar();
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            hideSearchBar();
        }
    });

    
    $('#randomWP').on('click', function(){
        $('#results').hide();
        getWikipediaRandom();
    });

    $('#search').keypress(function(event){
        if (event.keyCode === 10 || event.keyCode === 13) 
            event.preventDefault();
    });

    $('#search').bind("enterKeyPressed",function(e){
        searchValue = $('#search').val();
        hideSearchBar();
        if (searchValue.length > 0){
            getWikipediaResults(searchValue);
        }
    });

    $('#search').keyup(function(e){
        if(e.keyCode == 13){
            $(this).trigger("enterKeyPressed");
        }
    });

});