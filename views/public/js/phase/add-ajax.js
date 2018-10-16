/**
 * Created by hendrik.hendrik on 11/30/16.
 */
$(function(){
    // js for datepicker
    $('#inputStartDate').datepicker({
        todayBtn: 'linked',
        startDate: '0d',
        format: "yyyy/mm/dd"
    });
    $('#inputEndDate').datepicker({
        todayBtn: 'linked',
        startDate: '0d',
        format: "yyyy/mm/dd"
    });

    $("#btnAddPhase").click(function() {
        // clear error messages
        $('#errorMsg').empty();
        $('#errorMsg').removeClass();

        $.ajax({
            type: 'POST',
            url: '/phase/add',
            data: $('#formAddPhase').serialize(),
            success: function()
            {
                var successInfo = "Phase addition was successful";
                alert(successInfo);
                // redirect to home page
                window.location.replace("/account/welcome-mentee");
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                var errorInfo = "Phase addition was unsuccessful";
                // add error class
                $('#errorMsg').addClass('alert alert-danger');

                var serverResponse = JSON.parse(XMLHttpRequest.responseText);
                var errorCode = serverResponse.code;
                if (errorCode === 0){
                    var errorDetails = serverResponse.content;
                    var nbrOfErrors = errorDetails.length;
                    for(var i=0; i<nbrOfErrors; i++){
                        var errorDetail = errorDetails[i];
                        var errorMsg = errorDetail.msg;

                        $('#errorMsg').append(errorMsg + '<br>');
                    }
                } else if (errorCode === 1){
                    var errorMsg = serverResponse.msg;

                    $('#errorMsg').append(errorMsg + '<br>');
                }
            }
        });
    });
});