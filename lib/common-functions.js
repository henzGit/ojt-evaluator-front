/**
 * Created by hendrik.hendrik on 12/16/16.
 */

/**
 * Eliminate duplicate data
 * @param errors : list of error messages resulted from param validation
 * @returns {Array} : list of error messages without duplicate data
 */

function eliminateDoubleErrors(errors)
{
    var outputErrors = [];
    var inputKeys = {};

    for (var i=0; i<errors.length; i++) {
        var key = errors[i].param;

        if(!(key in inputKeys)){
            inputKeys[key] = true;
            outputErrors.push(errors[i]);
        }
    }
    return outputErrors;
}

/**
 * Validate if the input date and the input date are valid dates
 * @param inputStartDate : start date with the format 'YYYY/MM/DD'
 * @param inputEndDate : end date with the format 'YYYY/MM/DD'
 * @param errors : list of error messages resulted from param validation
 * @returns {Array} : list of error messages (after addition)
 */
function validateInputDates(inputStartDate, inputEndDate, errors)
{
    var startDate = new Date(inputStartDate);
    var endDate = new Date(inputEndDate);

    if (startDate > endDate) {
        var errorDate = {
            param : 'inputEndDate',
            msg : 'Start date has to be earlier than the end date',
            value : inputEndDate
        };

        if (errors.constructor === Array) {
            errors.push(errorDate);
        } else {
            errors = [errorDate];
        }
    }
    return errors;
}


/**
 * Format the input date to format 'YYYY/MM/DD'
 * @param inputDate :  raw date
 * @returns {string} : date with the format 'YYYY/MM/DD'
 */
function formatDate(inputDate)
{
    var inputDateYear = inputDate.substring(0,4);
    var inputDateMonth = inputDate.substring(5,7);
    var inputDateDate = inputDate.substring(8,10);
    var outputDate =
      inputDateYear + '/' + inputDateMonth + '/' + inputDateDate;

    return outputDate;
}

module.exports.eliminateDoubleErrors = eliminateDoubleErrors;
module.exports.validateInputDates = validateInputDates;
module.exports.formatDate = formatDate;