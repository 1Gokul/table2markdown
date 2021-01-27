
$(document).ready(function () {
    // Global variables
    var selectedCell = "none", selectedCellX = 0, selectedCellY = 0, IsEditing = false;

    // As there are already 3 rows and columns in the table, hide the header row and column buttons.
    DeselectCell();
    $('#bAcep').hide();
    $('#bCanc').hide();

    // Makes the table editable. (from bootstable.js)
    $('#input-table').SetEditable({

        // Execute when a row is added
        onAdd: function () {
            set_table_row_numbers();
            // $('table#input-table thead>tr').append("<td>3</td>")
            // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore( ".edithead-button" );
            // $("<td></td>" ).insertBefore( ".editrow-button" );
            // console.log($('table#input-table thead>tr>th:last').index());
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

                DeselectCell();
                //$(this).append("deselected");
            }
            else {
                // $(this).append("selected");
                selectedCell = el.target;
                selectedCellX = this.cellIndex;
                selectedCellY = this.parentNode.rowIndex;
                OnCellSelected();
            }

        }


    });

    // Adds a column to the right of the current column.
    $(document).on('click', '#bAddColumnRight', function () {
        // rowEdit(selectedCell);
    });

    
    $(document).on('click', '#bEdit', function () {
        IsEditing = true;
        rowEdit(selectedCell);
    });
    $(document).on('click', '#bAcep', function () {
        rowAcep(selectedCell);
        DeselectCell();
        IsEditing = false;
    });
    $(document).on('click', '#bCanc', function () {
        rowCancel(selectedCell);
        DeselectCell();
        IsEditing = false;
    });
    $(document).on('click', '#bElim', function () {
        rowElim(selectedCell);
        DeselectCell();
    });

    // If a cell is currently active, activate the buttons on the table-options menu.
    function OnCellSelected() {
        $('#column-menu > button').prop('disabled', false);
        $('#row-menu > button').prop('disabled', false);
        $('#align-menu > button').prop('disabled', false);
        $("#cell-position > h4").remove();
        $("#cell-position").append('<h4>[' + selectedCellX + '][' + selectedCellY + ']</h4>');
    }

    // Deactivate the buttons on the table-options menu once a cell is deselected.
    function DeselectCell() {
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



