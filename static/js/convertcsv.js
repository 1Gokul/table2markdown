$(document).ready(function () {

    // Show the filename of the selected csv file
    $(".custom-file-input").on("change", function () {

        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        var extension = $(".custom-file-input").val().split('/').pop().split('.')[1];
        var validImageTypes = ["csv"];
        if ($.inArray(extension, validImageTypes) < 0) {
            send_alert("Select a csv file.", 'danger');
            $("#submit-button").prop("disabled", true);
        } else {
            if($('.alert').length)send_alert("This is a valid file!", "primary");
            $("#submit-button").prop("disabled", false);
        }
    });

    function send_alert(message, type) {
        $(".alert").remove();
        $('<div class="alert alert-' + type + '" role="alert">' + message + '</div>').insertBefore(".custom-file");
    }




});