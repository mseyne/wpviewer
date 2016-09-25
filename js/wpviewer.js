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
            displayCards();
        }
    });
}

var displayCards = function(){
    $('#results').html('');
    $('#searchTitle').html(resultJSON[0]);
    var article = [];
    for (var i = 0; i < numbResult; i++){
        for (var content of resultJSON){
            if(content !== resultJSON[0]){
                article.push(content[i]);
            }
        }
        appendCard(article);
        article = [];
    }
}

var appendCard = function(article){
    var newCard = '<div class="divider"></div><a href="' + article[2] + '" target="_blank">';
    newCard += '<article class="card-panel result-card hoverable amber lighten-4 z-depth-1">';
    newCard += '<span class="title orange-text text-darken-4">' + article[0] + '</span> : '
    newCard += '<span class="description grey-text text-darken-3">' + article[1] + '</span></article></a>'
    $('#results').append(newCard);
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
        console.log('random');
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