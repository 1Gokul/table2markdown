$(document).ready(function () {
  function send_alert(message, type) {
    $(".alert").remove();
    $(
      '<div type="hidden" class="alert alert-' +
        type +
        '" role="alert">' +
        message +
        "</div>"
    )
      .insertBefore(".custom-file")
      .hide();
    $(".alert").fadeIn(400);
  }

  $("#excel-generate-button").on("click", function () {
    if ($("#input-excel").val().length) {
      $("#excel-generate-button").prop("disabled", true);

      $(".alert, .converting-notif").remove();
      $(
        '<span class="lead mx-lg-3 float-lg-right mx-sm-auto my-2 converting-notif">Converting...<i class="fas fa-circle-notch fa-spin ml-2"></i></span>'
      )
        .appendTo(".error-message-box")
        .hide()
        .fadeIn(300);

      let data = JSON.stringify($("#input-excel").val());
      $.ajax({
        type: "POST",
        url: Flask.url_for("convert_excel_table"),
        data: data,
        processData: false,
        contentType: "application/json;charset=UTF-8",
      })
        .done((responseObject) => {
          $("#excel-generate-button").prop("disabled", false);
          $(".converting-notif").remove();
          $(
            '<span class="lead mx-lg-3 float-lg-right mx-sm-auto my-2 converting-notif">Complete!<i class="far fa-check-circle ml-2"></i></span>'
          )
            .appendTo(".error-message-box")
            .hide()
            .fadeIn(300);

          display_result_table(responseObject);
        })
        .fail((error) => {
          console.log("Error during file convert: " + error);
        });
    } else {
      $(".alert, .converting-notif").remove();
      $(
        '<div class="alert alert-danger my-0" role="alert">Kindly paste an Excel table.</div>'
      )
        .appendTo(".error-message-box")
        .hide()
        .fadeIn(300);
    }
  });

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
      '"target="_blank" class="btn submit-download-link">Raw</a>';
    html +=
      '<a href="' +
      Flask.url_for("get_table", {
        view_type: "download",
        file_id: responseObject.resultFileID,
      }) +
      '"target="_blank" class="btn submit-download-link">Download</a></div></div></div>';

    $(html).insertAfter(".excel-paste-container");

    window.scrollTo(0, $("hr").offset().top);
  }
});
