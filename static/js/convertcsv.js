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
                send_alert("The file was bigger than the 10MB limit! Please select a smaller one.", 'danger');
            } else {
                if ($('.alert').length) send_alert("Nice, this one's valid!", "primary");
                $("#submit-button").prop("disabled", false);
            }
        }

    });

    function send_alert(message, type) {
        $(".alert").remove();
        $('<div class="alert alert-' + type + '" role="alert">' + message + '</div>').insertBefore(".custom-file");
    }

    $('#submit-button').on('click', function () {

        $(this).prop("disabled", true).html('Converting...<i class="fas fa-circle-notch fa-spin ml-2"></i>');
        $(".custom-file-input").prop("disabled", true);

        var $file = $("#csvFile").prop('files')[0];


        // $('#csvFile').parse({
        //     complete: function(results, file) {
        //         console.log("Parsing complete:", results, file);
        //     }
        // })

        Papa.parse($file, {
            complete: function (results) {
                console.log("Finished:", results.data);
                submit_converted_csv(results.data);
            }

        })


    });

    function submit_converted_csv(array) {
        // Convert the array into JSON
        var js_data = JSON.stringify(array);

        $.ajax({
                type: "POST",
                url: Flask.url_for("convert_csv_file"),
                data: js_data,
                processData: false,
                contentType: "application/json",
                dataType: "json",
            })
            .done((response) => {
                $('#submit-button').html('Complete!');
                console.log("Done!");
                display_result_table(response);
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
                viewType: "raw",
                fileID: responseObject.resultFileID,
            }) +
            '" class="btn submit-download-link">Raw</a>';
        html +=
            '<a href="' +
            Flask.url_for("get_table", {
                viewType: "download",
                fileID: responseObject.resultFileID,
            }) +
            '" class="btn submit-download-link">Download</a></div></div></div>';

        $(html).insertAfter(".csv-upload-container");

        window.scrollTo(0, $("hr").offset().top);
    }

});