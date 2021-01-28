
$(document).ready(function () {
    // Global variables
    var selectedCell = "none", selectedCellX = 0, selectedCellY = 0, IsEditing = false;

    // As there are already 3 rows and columns in the table, hide the header row and column buttons.
    deselect_cell();
    $('#bAcep').hide();
    $('#bCanc').hide();

    // Makes the table editable. (from bootstable.js)
    $('#input-table').SetEditable({

        // Execute when a row is added
        onAdd: function () {
            set_table_row_numbers();
        },
        // Execute when a row is deleted
        onDelete: function () {
            console.log("number of rows: " + $('#input-table > tbody > tr').length);
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

    function set_table_column_numbers() {
        //$('#input-table > thead > tr').each(function () {

        var $cols = $("#input-table > thead > tr").find('th');

        $cols.each(function (i, el) {
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
        // console.log($(this).closest('tr'));
        var $tab_en_edic = $('#input-table');

        var $row = $tab_en_edic.find('thead tr');
        var $cols = $row.find('th');

        var htmlDat = '';
        $cols.each(function (i, el) {
            console.log($(this).attr('name'));
            if ($(this).attr('name') == 'buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
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

    // Custom function to add a row above the clicked button's row.
    $(document).on('click', '#bAddRowUp', function () {

        rowData = create_row();
        $('<tr>' + rowData + '</tr>').insertBefore(selectedCell.closest('tr'));
        set_table_row_numbers();
        // $('table#input-table thead>tr').append("<td>3</td>")
        // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore(".edithead-button");
        // $("<td></td>").insertBefore(".editrow-button");
    });

    // Custom function to add a row below the clicked button's row.
    $(document).on('click', '#bAddRowDown', function () {
        rowData = create_row();

        console.log($(this).parent());
        if ($('#input-table >tbody >tr').length <= 0) {
            $($("#input-table").find('tbody')).append('<tr>' + rowData + '</tr>');
        }
        else {
            $('<tr>' + rowData + '</tr>').insertAfter(selectedCell.closest('tr'));
        }


        set_table_row_numbers();
        // $('table#input-table thead>tr').append("<td>3</td>")
        // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore(".edithead-button");
        // $("<td></td>").insertBefore(".editrow-button");
    });


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

    // Adds a column to the left of the current column.
    $(document).on('click', '#bAddColumnLeft', function () {
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
    $(document).on('click', '#bAddColumnRight', function () {
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


    $(document).on('click', '#bEdit', function () {
        IsEditing = true;
        rowEdit(selectedCell);
    });
    $(document).on('click', '#bAcep', function () {
        rowAcep(selectedCell);
        deselect_cell();
        IsEditing = false;
    });
    $(document).on('click', '#bCanc', function () {
        rowCancel(selectedCell);
        deselect_cell();
        IsEditing = false;
    });
    $(document).on('click', '#bElim', function () {
        rowElim(selectedCell);
        deselect_cell();
    });

    // If a cell is currently active, activate the buttons on the table-options menu.
    function select_cell() {

        // Hightlight the new cell
        $(selectedCell).addClass("selectedCell");
        selectedCellX = selectedCell.cellIndex;
        selectedCellY = selectedCell.parentNode.rowIndex;
        $('#column-menu > button').prop('disabled', false);
        $('#row-menu > button').prop('disabled', false);
        $('#align-menu > button').prop('disabled', false);
        $("#cell-position > h4").remove();
        $("#cell-position").append('<h4>[' + selectedCellX + '][' + selectedCellY + ']</h4>');
    }

    // Deactivate the buttons on the table-options menu once a cell is deselected.
    function deselect_cell() {
        $(selectedCell).removeClass("selectedCell");
        selectedCell = "none";
        $('#column-menu > button').prop('disabled', true);
        $('#row-menu > button').prop('disabled', true);
        $('#align-menu > button').prop('disabled', true);
        $("#cell-position > h4").remove();
        $("#cell-position").append('<h4>[-][-]</h4>');
        selectedCellX = 0;
        selectedCellY = 0;
    }
});



