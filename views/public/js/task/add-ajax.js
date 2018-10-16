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

    $("#btnAddPTask").click(function() {
        // clear error messages
        $('#errorMsg').empty();
        $('#errorMsg').removeClass();

        var inputPhaseId = $("#inputPhaseId").val();

        $.ajax({
            type: 'POST',
            url: '/task/add/phase/' + inputPhaseId ,
            data: $('#formAddTask').serialize(),
            success: function()
            {
                var successInfo = "Task addition was successful";
                alert(successInfo);

                // redirect to home page
                window.location.replace("/phase/view-tasks/" + inputPhaseId);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                var errorInfo = "Task addition was unsuccessful";

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