const savedQuote = window.localStorage.getItem('quote');
const savedAuthor = window.localStorage.getItem('author');
const savedHeart = window.localStorage.getItem('heart');
const savedQuotes = window.localStorage.getItem('likedQuotes');

const date = new Date();
const quoteDay = date.getDate() + "/" + (date.getMonth() + 1 );

let liked = [];
if(savedQuotes) {
  console.log(savedQuotes);
  liked = JSON.parse(savedQuotes);
}

$(document).ready(function() {
  if ("quote" in localStorage) {
    $('.quote').text(savedQuote);
    $('.author').text(savedAuthor);
    $('.twitter a').attr('href', ($('.twitter a').attr('href') + savedQuote + '  —  ' + savedAuthor));
    if("heart" in localStorage) {
      $('.heart').html(savedHeart);
    } else {
      $('.heart').html('<i class="far fa-heart like">');
    }
  } else {
    $.getJSON('https://api.quotable.io/random', function(quote) {
      $('.quote').text('"' + quote.content + '"');
      $('.author').text(quote.author);
      $('.twitter a').attr('href', ($('.twitter a').attr('href') + quote.content + '  —  ' + quote.author));
      window.localStorage.setItem('quote', $('.quote').text());
      window.localStorage.setItem('author', $('.author').text());
      window.localStorage.setItem('quote-day', quoteDay);
    });
  }
});

$(document).ready(function() {
  if ("likedQuotes" in localStorage) {
    if(liked.length === 0){
      window.localStorage.removeItem('likedQuotes');
      $('.liked-quotes-container').append("<p class='not-saved' style='color: rgba(237, 237, 237, 0.6)'>You haven't liked any quotes yet.</p>");
    } else {
      let quotes = [];
      for (let i = 0; i < liked.length; i++) {
        const index = liked[i].lastIndexOf('"')
        const quote = liked[i].substring(0, index + 1)
        const author = liked[i].substring(index + 2)
        quotes += `<p class="liked-quote">${quote}<span> ${author}</span><i class="fas fa-heart liked liked-container"></i></p><hr>`;
      }
      $('.liked-quotes-container').append(quotes)
      $('.not-saved').remove();
    }
  } else {
    $('.liked-quotes-container').append("<p class='not-saved' style='color: rgba(237, 237, 237, 0.6)'>You haven't liked any quotes yet</p>");
  }
});

// Clear localStorage from quote on new day -> one quote per day
var savedQuoteDay = window.localStorage.getItem('quote-day');
var now = day.getDate() + "/" + (day.getMonth() + 1 );

function deleteQuote() {
  if (savedQuoteDay != now) {
    localStorage.removeItem('quote');
    localStorage.removeItem('author');
    localStorage.removeItem('heart');
  }
}
deleteQuote();

// Like quote
$(document).on('click', '.like', function() {
  $('.like').removeClass('far like').addClass('fas liked liked-single');
  window.localStorage.setItem('heart', $('.heart').html());
  $('.liked-quotes-container').append('<p class="liked-quote">' + $('.quote').text() + ' <span>' + $('.author').text() + ' '+ ' </span><i class="fas fa-heart liked liked-container"></i></p><hr>');
  console.log($('.liked-quote').last().text());
  liked.push($('.liked-quote').last().text());
  window.localStorage.setItem('likedQuotes', JSON.stringify(liked));
  $('.not-saved').remove();
});

// Remove like
$(document).on('click', '.liked-single', function() {
  $('.liked-single').removeClass('fas liked').addClass('far like');
  window.localStorage.removeItem('heart');
  $('.liked-quote:last').remove();
  const index = liked.length;
  $(`hr:eq(${index})`).remove();
  liked.pop();
  window.localStorage.setItem('likedQuotes', JSON.stringify(liked));
  if(!$('.liked-quote').length){
    window.localStorage.removeItem('likedQuotes');
    $('.liked-quotes-container').append("<p class='not-saved' style='color: rgba(237, 237, 237, 0.6)'>You haven't liked any quotes yet.</p>");
  }
});
console.log(liked.length);
$(document).on('click', '.liked-container', function(e) {
  const deleted = $(e.target).parent().text()
  const filteredQuotes = liked.filter(function(e) { return e !== deleted; });
  console.log(deleted.includes($('.quote').text()));
  console.log(deleted);
  console.log($('.quote').text());
  if(deleted.includes($('.quote').text())) {
    $('.liked-single').removeClass('fas liked').addClass('far like');
    window.localStorage.removeItem('heart');
  }
  $(e.target).parent().next().remove();
  $(e.target).parent().remove()
  window.localStorage.setItem('likedQuotes', JSON.stringify(filteredQuotes));
  console.log(liked.length);
  if(!$('.liked-quote').length){
    window.localStorage.removeItem('likedQuotes');
    $('.liked-quotes-container').append("<p class='not-saved' style='color: rgba(237, 237, 237, 0.6)'>You haven't liked any quotes yet.</p>");
  }
});

// Hover over quote
$(document).on('mouseover', '.Daily-Quote', function() {
    $('.quote-additional').css('display', 'block');
    $('.quote').css('transform', 'translateY(-20px)');
    $('.quote-additional').css('transform', 'translateY(32px)');
  });

$(document).on('mouseout', '.Daily-Quote', function() {
    $('.quote-additional').css('display', 'none');
    $('.quote').css('transform', 'translateY(0px)');
    $('.quote-additional').css('transform', 'translateY(0px)');
  });

// View liked quotes
$('.liked-quotes').click(function(){
  $('.liked-quotes-container').fadeToggle();
  const offset = $(this).position();
  const leftTotal = parseInt(offset.left, 10) - 23 +'px';
  $('.liked-quotes-container').css('left', leftTotal);
});

// Hide when clicked outside
$(document).mouseup(function (e){
	if (!$('.liked-quotes-container').is(e.target) && !$('.liked-quotes').is(e.target)  && !$('.liked-quote').is(e.target) && !$('.quote-ellipsis').is(e.target) && !$('.like').is(e.target) && !$('.liked').is(e.target)){
		$('.liked-quotes-container').fadeOut();
  }
});
