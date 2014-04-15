$(document).ready(function(){

    $("#form-register").validate( {
        rules: {
            username: {
            	required: true,
                minlength: 5,
                maxlength: 20
            },
            email: {
                required: true,
                email: true,
                minlength: 3,
                maxlength: 40                
            },
            password: {
            	required: true,
                minlength: 6,
                maxlength: 20
            },
            passwordconfirm: {
            	required: true,
                minlength: 6,
                maxlength: 20,
                equalTo: "#password"
            }
            
        },
        messages: {
			username: {
				required: "Enter your username",
				minlength: "Enter at least 6 characters",
				maxlength: "Enter no more than 20 characters"
			},
            email: {
                required: "Enter your E-mail address",
                email: "Enter a valid E-mail address",
                minlength: "Enter at least 3 characters",
                maxlength: "Enter no more than 40 characters"
            },
			password: {
				required: "Enter your password",
				minlength: "Enter at least 6 characters",
				maxlength: "Enter no more than 20 characters"
			},
			passwordconfirm: {
				required: "Confirm your password",
				minlength: "Enter at least 6 characters",
				maxlength: "Enter no more than 20 characters",
				equalTo: "Passwords do not match"
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