/**
 * Created by hendrik.hendrik on 12/5/16.
 */
$(function(){
    $("#btnLoginAccount").click(function() {
        // clear error messages
        $('#errorMsg').empty();
        $('#errorMsg').removeClass();

        $.ajax({
            type: 'POST',
            url: '/account/login',
            data: $('#formLoginAccount').serialize(),
            success: function(res) {
                var successInfo = "Login was successful";
                alert(successInfo);

                var accountType = res.content.account_type;
                var content = res.content;
                var secret = res.secret;
                var otherData = res.otherData;

                // redirect to home page according to the account type
                if (accountType === 1) {
                    $.redirect('/account/welcome-mentee', {}, 'GET');
                } else if (accountType == 2) {
                    $.redirect('/account/welcome-mentor', {}, 'GET');
                } else {
                    window.location.replace("/");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                var errorInfo = "Login was unsuccessful";

                // add error class
                $('#errorMsg').addClass('alert alert-danger');

                var serverResponse = JSON.parse(XMLHttpRequest.responseText);
                var errorCode = serverResponse.code;

                if (errorCode === 0){
                    var errorDetails = serverResponse.content;
                    var nbrOfErrors = errorDetails.length;
                    for (var i=0; i<nbrOfErrors; i++) {
                        var errorDetail = errorDetails[i];
                        var errorMsg = errorDetail.msg;
                        $('#errorMsg').append(errorMsg + '<br>');
                    }
                } else if (errorCode === 1) {
                    var errorMsg = serverResponse.msg;
                    $('#errorMsg').append(errorMsg + '<br>');
                }
            }
        });
    });
});