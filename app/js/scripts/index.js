$(document).ready(function() {

	$('.sport-pic').mouseenter(function(){
  		$(this).animate({top:'-=20px'}, 500);
	});

	$('.sport-pic').mouseleave(function(){
  		$(this).animate({top:'+=20px'}, 500);
	});

});
