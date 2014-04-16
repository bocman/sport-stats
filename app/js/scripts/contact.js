$(document).ready(function() {

	$('div.col-xs-2 > img').mouseenter(function(){
  		$(this).animate({top:'-=13px'}, 500);
  		$(this).siblings("strong").removeClass("invisible");
  	});

	$('div.col-xs-2 > img').mouseleave(function(){
  		$(this).animate({top:'+=13px'}, 500);
  		$(this).siblings("strong").addClass("invisible")
  	});

});