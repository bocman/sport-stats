$(document).ready(function() {

	var year = new Date().getFullYear();
	var j = 0;

	for(i = 1950; i <=year; i++) {
		$("#testDiv").append("&nbsp;");
     $('<button/>', {
        text: i, //set text 1 to 10
        id: 'btn_'+i,

        click: function () { alert('hi'); }
    }).addClass("btn btn-info").appendTo("#testDiv");
    
    j++;
    if(++j == 10){
    	$('#testDiv').append("<br />");
    	//$('#testDiv').append("<br />");
    	j = 0;
    }


     $("#testDiv").append("&nbsp;");
  }

});