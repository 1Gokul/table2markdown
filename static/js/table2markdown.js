
$(document).ready(function () {
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
            set_table_row_numbers();
        }
    });


    function set_table_row_numbers() {
        var i = 0;
        $("#input-table tbody>tr>th").each(function () {
            $(this).html(++i);
        });
    }

    // Custom function to append a row to the clicked button's row.
    $(document).on('click', '#bAdd', function () {

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

        $('<tr>' + htmlDat + '</tr>').insertAfter($(this).closest('tr'));

        set_table_row_numbers();
        // $('table#input-table thead>tr').append("<td>3</td>")
        // $('<th scope="col">' + $('table#input-table thead>tr>th:last').index() + '</th>').insertBefore(".edithead-button");
        // $("<td></td>").insertBefore(".editrow-button");
    });
});