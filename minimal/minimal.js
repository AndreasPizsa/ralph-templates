$('console').append('Hi!')
console.log = console.error = console.debug = function() {
  const $console = $('#console');
  $console.append.apply($console, arguments);
}

if(typeof _pjscMeta === 'undefined') var _pjscMeta = {};
_pjscMeta.manualWait=true;

(function parseWindowLocationQuery(){
  var d=decodeURIComponent,
      l=window.location,
      q=l.query=l.query||{},
      p=l.search.substr(1).split('&'),
      i,
      kv;
  while(i=p.pop()) {
    (kv=i.match(/([^=]*)=?(.*)/)) && (q[d(kv[1]).toLowerCase()]=d(kv[2]));
  }
})();

$(function(){
	const {access_token, review_id} = window.location.query;
/*  const { access_token, review_id } = {
		access_token:'EAADKatZCjwx4BAGOE2MYfqUUdokR1H0l7gVwittZCXYcU7cuZAhOC4PvseHWevleZBToQG9dWY399Izbs4mzZAr9DTZBjYHbanAiPE65UzZBUvZAYb0p4q3HX3YjtyHlgNyPNTGzLs3UZAuAmShyVELZB5nngCZBOOvWAH5VZC3kI57uzURfBAVXnKp1hxoIod2tgJMZD',
  	review_id: '10207589089067908'
  };
*/

  const batch = JSON.stringify([{
  	name: 'review',
  	method: 'GET',
    relative_url: `${review_id}?fields=from{name, picture.type(large)},data,likes.limit(0),comments.limit(0)`,
    omit_response_on_success: false
  }, {
  	name: 'reviewer',
  	method: 'GET',
    relative_url: '?ids={result=review:$.from.id}&fields=name,picture.type(large)'
  }, {
  	name: 'place',
    method:'GET',
    relative_url: '/me?fields=name,category,cover,picture.type(large)'
  }]);

  $.ajax({
    url: 'https://graph.facebook.com/v2.10/'
      + '?batch=' + JSON.stringify(batch)
      + '&access_token=' + access_token,
    method: 'post',
    contentType: 'multipart/form-data',
    dataType: 'json',
    data: {
      access_token,
      batch
    }
  })

  .done( ([ reviewResponse, reviewerResponse, placeResponse]) => {
  	reviewResponse   = JSON.parse(reviewResponse.body);
    reviewerResponse = JSON.parse(reviewerResponse.body)[reviewResponse.from.id];
    placeResponse    = JSON.parse(placeResponse.body);
    console.log({reviewResponse, reviewerResponse, placeResponse});

    const starsCount = Math.round(5 * (reviewResponse.data.rating.value / reviewResponse.data.rating.scale), 0);
    const stars = $('.star');
    let i;
    for(i=4;i>=starsCount;i--) $(stars[i]).css('opacity', 0.5);

    $('#reviewer_image').css('background-image', `url(${reviewerResponse.picture.data.url})`);
    $('#reviewer_name').text(reviewerResponse.name);
    $('#review_text').text(reviewResponse.data.review_text);
    $('#page_image').css('background-image', `url(${placeResponse.picture.data.url})`);
    $('.place-name').text(placeResponse.name);
    $('.place-category').text(placeResponse.category);
  })

  .catch(console.error.bind(console))

  .always(function(){
    _pjscMeta.optionsOverrides = _pjscMeta.optionsOverrides || {};
    _pjscMeta.optionsOverrides.clipRectangle = {
      top:    0,
      left:   0,
      width:  $('body').outerWidth(),
      height: $('body').outerHeight()
    };
    _pjscMeta.manualWait=false;
  })

});
