$(document).ready(function(){

    $("#form-sign-in").validate( {
        rules: {
            email: {
                required: true,
                email: true           
            },
            password: {
            	required: true
            }
        },
        messages: {
            email: {
                required: "Enter your E-mail address",
                email: "Enter a valid E-mail address",
               
            },
			password: {
				required: "Enter your password"	
			}
		},
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); 
            $(element).parent().find('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-remove');         
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
            $(element).parent().find('.form-control-feedback').removeClass('glyphicon-remove').addClass('glyphicon-ok');
        }

    });
});