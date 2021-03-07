$(document).ready(function () {

    // Show the filename of the selected csv file
    $(".custom-file-input").on("change", function () {

        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        // Check if the extension of the file is '.csv'
        var extension = $(".custom-file-input").val().split('/').pop().split('.')[1];
        var validImageTypes = ["csv"];
        if ($.inArray(extension, validImageTypes) < 0) {
            send_alert("Kindly select a CSV file.", 'danger');
            $("#submit-button").prop("disabled", true);
        } else {
            // Else if file is larger than 10MB(The size limit)
            if ($("#csvFile").prop('files')[0].size > 10 * 1024 * 1024) {
                send_alert("This file is larger than the 10MB limit! Please select a smaller one.", 'danger');
                $("#submit-button").prop("disabled", true);
            } else {
                if ($('.alert').length) send_alert("Nice, this one's good to go!", "primary");
                $("#submit-button").prop("disabled", false);
            }
        }

    });

    function send_alert(message, type) {
        $(".alert").remove();
        $('<div type="hidden" class="alert alert-' + type + '" role="alert">' + message + '</div>').insertBefore(".custom-file").hide();
        $(".alert").fadeIn(400);
    }

    $('#submit-button').on('click', function () {



        // Get the user's decision on whether to convert directly or not
        var convertOption = $('input[name=modify-or-not]:checked', '#csv-form').val();
        if (convertOption) {
            // Disable the submit button to prevent further submits
            $(this).prop("disabled", true).html('Converting...<i class="fas fa-circle-notch fa-spin ml-2"></i>');
            // Disable the file inputs and radio buttons 
            $(".custom-file-input, input[name=modify-or-not]").prop("disabled", true);

            var $file = $("#csvFile").prop('files')[0];


            // $('#csvFile').parse({
            //     complete: function(results, file) {
            //         console.log("Parsing complete:", results, file);
            //     }
            // })

            Papa.parse($file, {
                complete: function (results) {
                    console.log("Finished:", results.data);
                    submit_converted_csv(results.data, convertOption);
                }

            })

        } else {
            send_alert("Kindly select one of the options below.", 'danger');
            $(".form-check-label").addClass("border-bottom border-danger");
        }

    });

    function submit_converted_csv(array, convertOption) {

        $.ajax({
                type: "POST",
                url: Flask.url_for("convert_csv_file"),
                data: JSON.stringify({
                    'data': array,
                    'convertOption': convertOption
                }),
                processData: false,
                contentType: "application/json;charset=UTF-8",
            })
            .done((responseObject) => {
                $('#submit-button').html('Complete!<i class="far fa-check-circle ml-2">');
                if (convertOption === 'modify-false') {
                    display_result_table(responseObject);
                } else {

                    var html = '<a href="' +
                        Flask.url_for("insert_and_convert", {
                            operation: "edit-csv",
                            file_id: responseObject.resultFileID,
                        }) +
                        '" class="btn submit-download-link">Proceed to Edit<i class="fas fa-external-link-alt mx-2"></i></a>';

                    $(html).insertAfter('#submit-button')
                }

            })
            .fail((error) => {
                console.log("Error during file convert: " + error);
            });


    }

    // Display the result of the conversion to the user.
    function display_result_table(responseObject) {
        // If there were any previously existing results, remove them.
        $("#result-container").remove();
        $("#result-rule").remove();

        // Display the result
        var html =
            '<hr id="result-rule" size="2" width="100%" align="center" noshade>';
        html +=
            '<div id="result-container" class="result-container"><h1>Your converted table</h1>';
        html +=
            '<div class="card result-box mt-5"><div class="grid-child result-text darkerbg">' +
            responseObject.resultTable +
            "</div>";
        html +=
            '<div class="grid-child links"><a href="' +
            Flask.url_for("get_table", {
                view_type: "raw",
                file_id: responseObject.resultFileID,
            }) +
            '" class="btn submit-download-link">Raw</a>';
        html +=
            '<a href="' +
            Flask.url_for("get_table", {
                view_type: "download",
                file_id: responseObject.resultFileID,
            }) +
            '" class="btn submit-download-link">Download</a></div></div></div>';

        $(html).insertAfter(".csv-upload-container");

        window.scrollTo(0, $("hr").offset().top);
    }

});