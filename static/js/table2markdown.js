
$(document).ready(function () {


    // As there are already 3 rows and columns in the table, hide the header row and column buttons.
    $(".header-row-button").addClass("hidden");
    $(".header-col-button").addClass("hidden");

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
            if($('#input-table > tbody > tr').length <= 0){
                $(".header-row-button").removeClass("hidden");
            }
            set_table_row_numbers();
        }
    });


    function set_table_row_numbers() {
        var i = 0;
        $("#input-table tbody>tr>th").each(function () {
            $(this).html(++i);
        });
    }

    function create_row(){
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

        $('<tr>' + rowData + '</tr>').insertBefore($(this).closest('tr'));

        set_table_row_numbers();
        // $('table#input-table thead>tr').append("<td>3</td>")
        // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore(".edithead-button");
        // $("<td></td>").insertBefore(".editrow-button");
    });

    // Custom function to add a row below the clicked button's row.
    $(document).on('click', '#bAddRowDown', function (evt) {
        var target = $(evt.target);

        rowData = create_row();

        console.log($(this).parent());
        if ($("ul#table-options").parents(target).length) {
            console.log("Found the parent!");
            $($("#input-table").find('tbody')).append('<tr>' + rowData + '</tr>');
        }
        else{
            $('<tr>' + rowData + '</tr>').insertAfter($(this).closest('tr'));
        }
        

        set_table_row_numbers();

        if($('#input-table > tbody > tr').length > 0){
            $(".header-row-button").addClass("hidden");
        }
        // $('table#input-table thead>tr').append("<td>3</td>")
        // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore(".edithead-button");
        // $("<td></td>").insertBefore(".editrow-button");
    });

});