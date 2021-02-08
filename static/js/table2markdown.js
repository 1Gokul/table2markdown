
$(document).ready(function () {
    // Global variables
    var selectedCell = "none", selectedCellX = 0, selectedCellY = 0, IsEditing = false;

    // Hide the Accept and Cancel buttons. These buttons appear only when a cell is being edited.
    deselect_cell();
    $('.card-body').find('.bAcep').hide();
    $('.card-body').find('.bCanc').hide();
    $('.undo').prop('disabled', true);
    $('.redo').prop('disabled', true);


    // Makes the table editable. (from bootstable.js)
    $('#input-table').SetEditable({

        // Execute when a row is added
        onAdd: function () {
            set_table_row_numbers();
        },
        // Execute when a row is deleted
        onDelete: function () {
            //console.log("number of rows: " + $('#input-table > tbody > tr').length);
            if ($('#input-table > tbody > tr').length <= 0) {
                $("#row-menu").removeClass("hidden");
            }
            set_table_row_numbers();
        }
    });

    // Sets the row numbers. Usually called when a row is added or deleted.
    function set_table_row_numbers() {
        var i = 0;
        $("#input-table tbody>tr>th").each(function () {
            $(this).html(++i);
        });

        // Also update the new position of the selected cell.
        select_cell();
    }
    // Sets the column numbers. Usually called when a column is added or deleted.
    function set_table_column_numbers() {

        // Find the table headers
        var $cols = $("#input-table > thead > tr").find('th');

        // Iterate through the headers
        $cols.each(function (i, el) {
            // The first column's header is '#'
            if (i == 0) {

                $(this).replaceWith('<th scope="col">#</th>');
            }
            else {
                $(this).replaceWith('<th scope="col">' + i + '</th>');
            }
        })

        // Also update the new position of the selected cell.
        select_cell();
    }

    // Creates the row to be added
    function create_row() {
        // Get the input table
        var $tab_en_edic = $('#input-table');

        // Find the rows and columns
        var $row = $tab_en_edic.find('thead tr');
        var $cols = $row.find('th');

        var htmlDat = '';
        // Iterate through each column of the selectedCell's row and set them up to be editable.
        $cols.each(function (i, el) {
            if ($(this).attr('name') == 'buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;
            } else {
                if (i == 0) {
                    htmlDat += '<th scope="row"></th>'
                }
                else {
                    htmlDat = htmlDat + '<td></td>';
                }
            }
        });

        return htmlDat;
    }


    // If a cell is currently active, activate the buttons on the table-options menu.
    function select_cell() {

        // Hightlight the new cell
        $(selectedCell).addClass("selectedCell");
        selectedCellX = selectedCell.cellIndex;
        selectedCellY = selectedCell.parentNode.rowIndex;
        $('.column-menu > button,.row-menu > button,.text-menu > button').removeAttr('disabled');
        // $(".cell-position > h4").remove();
        // $(".cell-position").append('<h4>[' + selectedCellX + '][' + selectedCellY + ']</h4>');
    }

    // Deactivate the buttons on the table-options menu once a cell is deselected.
    function deselect_cell() {

        // Remove the highlight from the selectedCell
        $(selectedCell).removeClass("selectedCell");
        selectedCell = "none";
        $('.column-menu > button,.row-menu > button,.text-menu > button').attr('disabled', 'disabled', 'disabled');
        // $(".cell-position > h4").remove();
        // $(".cell-position").append('<h4>[-][-]</h4>');
        selectedCellX = 0;
        selectedCellY = 0;
    }

    // Display the result of the conversion to the user.
    function display_result_table(responseObject) {

        // If there were any previously existing results, remove them.
        $("#result-container").remove();
        $("#result-rule").remove();

        // Display the result
        var html = '<hr id="result-rule" size="2" width="100%" align="center" noshade>'
        html += '<div id="result-container" class="result-container"><h1>Your converted table</h1>'
        html += '<div class="card result-box mt-5"><div class="grid-child result-text darkerbg">' + responseObject.resultTable + '</div>';
        html += '<div class="grid-child links"><a href="' + Flask.url_for("get_table", { "viewType": "raw", "fileID": responseObject.resultFileID}) + '" class="btn downloadlink">Raw</a>';
        html += '<a href="' + Flask.url_for("get_table", { "viewType": "download", "fileID": responseObject.resultFileID }) + '" class="btn downloadlink">Download</a></div></div></div>';

        $(html).insertAfter('#input-table-card');

        window.scrollTo(0, $("hr").offset().top);
    }


    // When a table's row is selected.
    $(document).on('click', '#input-table > tbody > tr > td', function (el) {
        // row was clicked

        if (!IsEditing) {
            if (selectedCell == el.target) {

                deselect_cell();
            }
            else {
                // Remove the highlight of the previously selected cell
                $(selectedCell).removeClass("selectedCell");

                // Assign the new cell
                selectedCell = el.target;
                select_cell();
            }

        }


    });

    // Custom function to add a row above the clicked button's row.
    $(document).on('click', '.bAddRowUp', function () {

        // Create the row
        rowData = create_row();

        // Add the row above the current one
        $('<tr>' + rowData + '</tr>').insertBefore(selectedCell.closest('tr'));
        set_table_row_numbers();
    });

    // Custom function to add a row below the clicked button's row.
    $(document).on('click', '.bAddRowDown', function () {
        // Create the row
        rowData = create_row();

        // If the length of the table is zero, add the row at the beginning.
        if ($('#input-table >tbody >tr').length <= 0) {
            $($("#input-table").find('tbody')).append('<tr>' + rowData + '</tr>');
        }
        // Else add the row below the current one
        else {
            $('<tr>' + rowData + '</tr>').insertAfter(selectedCell.closest('tr'));
        }


        set_table_row_numbers();
    });



    // Adds a column to the left of the current column.
    $(document).on('click', '.bAddColumnLeft', function () {
        // Add a header cell before the selected cell's header, thus forming a column.
        $('#input-table thead tr th').each(function (i, el) {

            if (i == selectedCellX) {
                $('<th scope="col">' + i + '</th>').insertBefore(el);
            }
        })

        // Add the cells beneath the newly formed column.
        $('#input-table tbody tr').each(function () {
            var $cols = $(this).find('td');
            $cols.each(function (i, el) {
                if ((i + 1) == selectedCellX) {
                    $('<td></td>').insertBefore(el);
                    return false;
                }
            })

        })

        set_table_column_numbers();
    });

    // Adds a column to the right of the current column.
    $(document).on('click', '.bAddColumnRight', function () {
        // Add a header cell before the selected cell's header, thus forming a column.
        $('#input-table thead tr th').each(function (i, el) {

            if (i == selectedCellX) {
                $('<th scope="col">' + i + '</th>').insertAfter(el);
            }
        })

        // Add the cells beneath the newly formed column.
        $('#input-table tbody tr').each(function () {
            var $cols = $(this).find('td');
            $cols.each(function (i, el) {
                if ((i + 1) == selectedCellX) {
                    $('<td></td>').insertAfter(el);
                    return false;
                }
            })

        })

        set_table_column_numbers();
    });

    // Deletes the selectedCell's column
    $(document).on('click', '.bDeleteColumn', function () {


        $('#input-table thead tr th').each(function (i, el) {

            if (i == selectedCellX) {
                el.remove();
            }
        })

        // Find and delete the cells of the column
        $('#input-table tbody tr').each(function () {
            var $cols = $(this).find('td');
            $cols.each(function (i, el) {
                if ((i + 1) == selectedCellX) {
                    el.remove();
                    return false;
                }
            })

        })

        set_table_column_numbers();
    });

    $(document).on('click', '.bEdit', function () {
        IsEditing = true;
        $('.generate-table-button > button, .text-menu > button').attr('disabled', 'disabled');
        rowEdit(selectedCell);
    });
    $(document).on('click', '.bAcep', function () {
        rowAcep(selectedCell);
        $('.generate-table-button > button, .text-menu > button').removeAttr('disabled');
        deselect_cell();
        IsEditing = false;
    });
    $(document).on('click', '.bCanc', function () {
        rowCancel(selectedCell);
        $('.generate-table-button > button, .text-menu > button').removeAttr('disabled');
        deselect_cell();
        IsEditing = false;
    });
    $(document).on('click', '.bElim', function () {
        rowElim(selectedCell);
        deselect_cell();
    });



    // Makes the text in the selectedCell bold.
    $(document).on('click', '.make-bold', function () {

        var currentContents = $(selectedCell).html();
        console.log(currentContents);

        if (!currentContents.includes('<b>')) {
            var newContents = '<b>' + currentContents + '</b>';
            $(selectedCell).html(newContents);
        }

    });

    // Makes the text in the selectedCell italic.
    $(document).on('click', '.make-italic', function () {

        var currentContents = $(selectedCell).html();
        console.log(currentContents);

        if (!currentContents.includes('<i>')) {
            var newContents = '<i>' + currentContents + '</i>';
            $(selectedCell).html(newContents);
        }

    });

    // Makes the text in the selectedCell strikethrough.
    $(document).on('click', '.make-strikethrough', function () {

        var currentContents = $(selectedCell).html();
        console.log(currentContents);

        if (!currentContents.includes('<del>')) {
            var newContents = '<del>' + currentContents + '</del>';
            $(selectedCell).html(newContents);
        }

    });

    // Generates the table with the current data
    $(document).on('click', '.bGenerateTable', function () {

        var resultArray = new Array();

        // Loop through each row
        $('#input-table > tbody > tr').each(function () {

            // Temporary inner array
            var innerArray = new Array();

            // Add the data of each element to innerArray
            $(this).find('td').each(function () {

                var ele = $(this).html();

                // If the cell is blank, add a hyphen
                if (ele === "") innerArray.push('-');
                else innerArray.push(ele);

            });
            resultArray.push(innerArray);
        });

        // Convert the array into JSON
        var js_data = JSON.stringify(resultArray);


        $.ajax({
            "type": 'POST',
            "url": Flask.url_for('convert_table'),
            "data": js_data,
            "processData": false,
            "contentType": 'application/json',
            "dataType": 'json'
        })
            .done((response) => {

                //console.log("Done!");
                display_result_table(response);
            })
            .fail((error) => {
                console.log("Error during file convert: " + error);
            });



    });

});



