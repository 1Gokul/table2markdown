/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @author Tito Hinostroza
*/
"use strict";
//Global variables
var params = null; //Parameters
var colsEdi = null;
const tabID = "input-table";
var newColHtml =
  "<div class='btn-group pull-right'>" +
  "<button id='bEdit' type='button' class='btn btn-secondary'  onclick='rowEdit(this);'>" +
  "<i class='fas fa-pencil-alt'></i>" +
  "</button>" +
  "<button id='bAddRowUp' type='button' class='btn btn-success'>" +
  "<i class='fas fa-plus'></i>" +
  "<i class='fas fa-long-arrow-alt-up'></i>" +
  "</button>" +
  "<button id='bAddRowDown' type='button' class='btn btn-success'>" +
  "<i class='fas fa-plus'></i>" +
  "<i class='fas fa-long-arrow-alt-down'></i>" +
  "</button>" +
  "<button id='bElim' type='button' class='btn btn-danger'  onclick='rowElim(this);'>" +
  "<i class='fas fa-trash' aria-hidden='true'></i>" +
  "</button>" +
  "<button id='bAcep' type='button' class='btn btn-success'  style='display:none;' onclick='rowAcep(this);'>" +
  "<i class='fas fa-check'></i>" +
  "</button>" +
  '<button id="bCanc" type="button" class="btn btn-danger" style="display:none;"  onclick="rowCancel(this);">' +
  '<i class="fas fa-times" aria-hidden="true"></i>' +
  "</button>" +
  "</div>";

var saveColHtml =
  '<div class="btn-group pull-right">' +
  "<button id='bEdit' type='button' class='btn btn-secondary' style='display:none;'>" +
  '<i class="fas fa-pencil-alt"></i>' +
  "</button>" +
  "<button id='bAddRowUp' type='button' style='display:none;' class='btn btn-success'>" +
  '<i class="fas fa-plus"></i>' +
  '<i class="fas fa-long-arrow-alt-up"></i>' +
  "</button>" +
  "<button id='bAddRowDown' type='button' style='display:none;' class='btn btn-success'>" +
  '<i class="fas fa-plus"></i>' +
  '<i class="fas fa-long-arrow-alt-down"></i>' +
  "</button>" +
  "<button id='bElim' type='button' class='btn btn-danger' style='display:none;' onclick='rowElim(this);'>" +
  "<i class='fas fa-trash' aria-hidden='true'></i>" +
  "</button>" +
  "<button id='bAcep' type='button' class='btn btn-success'   onclick='rowAcep(this);'>" +
  "<i class='fas fa-check'></i>" +
  "</button>" +
  "<button id='bCanc' type='button' class='btn btn-danger'  onclick='rowCancel(this);'>" +
  "<i class='fas fa-times' aria-hidden='true'></i>" +
  "</button>" +
  "</div>";
// var colEdicHtml = '<td class="editrow-button" name="buttons">' + newColHtml + '</td>';
// var colSaveHtml = '<td name="buttons">' + saveColHtml + '</td>';

$.fn.SetEditable = function (options) {
  var defaults = {
    columnsEd: null, //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
    $addButton: null, //Jquery object of "Add" button
    onEdit: function () {}, //Called after edition
    onBeforeDelete: function () {}, //Called before deletion
    onDelete: function () {}, //Called after deletion
    onAdd: function () {}, //Called when added a new row
  };
  params = $.extend(defaults, options);

  // this.find('thead th').append('<button type="button" id="bAddColumnLeft" class="btn btn-sm btn-success ml-1 mr-1"><i class="fas fa-long-arrow-alt-left fa-xs" aria-hidden="true"></i></button>');
  // this.find('thead th').append('<button type="button" id="bAddColumnRight" class="btn btn-sm btn-success mr-1"><i class="fas fa-long-arrow-alt-right fa-xs" aria-hidden="true"></i></button>');
  // this.find('thead th').append('<button type="button" id="bDeleteColumn" class="btn btn-sm btn-danger mr-1"><i class="fas fa-trash fa-xs" aria-hidden="true"></i></button>');

  // this.find('thead tr').append('<th class="edithead-button" name="buttons"></th>');
  // this.find('tbody tr').append(colEdicHtml);
  //Process "addButton" parameter
  // if (params.$addButton != null) {
  //     //Se proporcionó parámetro
  //     params.$addButton.click(function () {
  //         console.log("not nnull");
  //         var $tabedi = 'input-table';
  //         rowAddNew($tabedi);
  //     });
  // }
  //Process "columnsEd" parameter
  if (params.columnsEd != null) {
    //Extract felds
    colsEdi = params.columnsEd.split(",");
  }
};

function IterarCamposEdit($cols, tarea) {
  //Itera por los campos editables de una fila
  var n = 0;
  $cols.each(function () {
    n++;
    if ($(this).attr("name") == "buttons") return; //excluye columna de botones
    if (!EsEditable(n - 1)) return; //noe s campo editable
    tarea($(this));
  });

  function EsEditable(idx) {
    //Indica si la columna pasada está configurada para ser editable
    if (colsEdi == null) {
      //no se definió
      return true; //todas son editable
    } else {
      //hay filtro de campos
      //alert('verificando: ' + idx);
      for (var i = 0; i < colsEdi.length; i++) {
        if (idx == colsEdi[parseInt(i, 10)]) return true;
      }
      return false; //no se encontró
    }
  }
}

function FijModoNormal(but) {
  $(".card-body").find(".bAcep").hide(200, "linear");
  $(".card-body").find(".bCanc").hide(200, "linear");
  $(".card-body").find(".bEdit").show(200, "linear");
  $(".card-body").find(".bElim").show(200, "linear");
  $(".card-body").find(".bAdd").show(200, "linear");
  $(".card-body").find(".bAddRowUp").show(200, "linear");
  $(".card-body").find(".bAddRowDown").show(200, "linear");

  var $row = $(but).parents("tr"); //accede a la fila
  $row.attr("id", ""); //quita marca
}

function FijModoEdit(but) {
  $(".card-body").find(".bAcep").show(200, "linear");
  $(".card-body").find(".bCanc").show(200, "linear");
  $(".card-body").find(".bEdit").hide(200, "linear");
  $(".card-body").find(".bElim").hide(200, "linear");
  $(".card-body").find(".bAdd").hide(200, "linear");
  $(".card-body").find(".bAddRowUp").hide(200, "linear");
  $(".card-body").find(".bAddRowDown").hide(200, "linear");
  var $row = $(but).parents("tr"); //accede a la fila
  $row.attr("id", "editing"); //indica que está en edición
}

function ModoEdicion($row) {
  if ($row.attr("id") == "editing") {
    return true;
  } else {
    return false;
  }
}

function rowAcep(but) {
  //Acepta los cambios de la edición

  var $row = $(but).parents("tr"); //accede a la fila
  var $cols = $row.find("td"); //lee campos
  if (!ModoEdicion($row)) return; //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = $td.find("input").val(); //lee contenido del input
    $td.html(cont); //fija contenido y elimina controles
  });
  FijModoNormal(but);
  params.onEdit($row);
}

function rowCancel(but) {
  //Rechaza los cambios de la edición
  var $row = $(but).parents("tr"); //accede a la fila
  var $cols = $row.find("td"); //lee campos
  if (!ModoEdicion($row)) return; //Ya está en edición
  //Está en edición. Hay que finalizar la edición
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = $td.find("div").html(); //lee contenido del div
    $td.html(cont); //fija contenido y elimina controles
  });
  FijModoNormal(but);
}

function rowEdit(but) {
  var $td = $("tr[id='editing'] td");
  rowAcep($td);
  var $row = $(but).parents("tr");
  var $cols = $row.find("td");
  if (ModoEdicion($row)) return; //Ya está en edición
  //Pone en modo de edición
  IterarCamposEdit($cols, function ($td) {
    //itera por la columnas
    var cont = $td.html(); //lee contenido
    var div = '<div style="display: none;">' + cont + "</div>"; //guarda contenido
    var input =
      '<input class="form-control input-sm data-insert-cell"  style="min-width:30%" value="' +
      cont +
      '">';
    $td.html(div + input); //fija contenido
  });
  FijModoEdit(but);
}

function rowElim(but) {
  //Elimina la fila actual
  var $row = $(but).parents("tr"); //accede a la fila
  params.onBeforeDelete($row);
  $row.remove();
  params.onDelete();
}

function rowAddNew(tabId) {
  //Agrega fila a la tabla indicada.
  console.log(tabId);
  console.log($(this));
  var $tab_en_edic = $("#" + tabId); //Table to edit
  var $filas = $tab_en_edic.find("tbody tr");
  // if ($filas.length == 0) {
  //No hay filas de datos. Hay que crearlas completas
  var $row = $tab_en_edic.find("thead tr"); //encabezado
  var $cols = $row.find("th"); //lee campos
  //construye html
  var htmlDat = "";
  $cols.each(function () {
    if ($(this).attr("name") == "buttons") {
      //Es columna de botones
      htmlDat = htmlDat + colEdicHtml; //agrega botones
    } else {
      htmlDat = htmlDat + "<td></td>";
    }
  });
  $(this)
    .closest("tr")
    .insertAfter("<tr>" + htmlDat + "</tr>");
  // } else {
  //     //Hay otras filas, podemos clonar la última fila, para copiar los botones
  //     var $ultFila = $tab_en_edic.find('tr:last');
  //     $ultFila.clone().appendTo($ultFila.parent());
  //     $tab_en_edic.find('tr:last').attr('id', 'editing');
  //     $ultFila = $tab_en_edic.find('tr:last');
  //     var $cols = $ultFila.find('td');  //lee campos

  //     $cols.each(function () {
  //         //console.log($(this).parent());
  //         if ($(this).attr('name') == 'buttons') {
  //             //Es columna de botones
  //         } else {
  //             var div = '<div style="display: none;"></div>';  //guarda contenido
  //             var input = '<input class="form-control input-sm"  value="">';

  //             $(this).html(div + input);  //limpia contenido
  //         }
  //     });
  //     $ultFila.find('td:last').html(saveColHtml);

  // }
  params.onAdd();
}

function TableToCSV(tabId, separator) {
  //Convierte tabla a CSV
  var datFil = "";
  var tmp = "";
  var $tab_en_edic = $("#" + tabId); //Table source
  $tab_en_edic.find("tbody tr").each(function () {
    //Termina la edición si es que existe
    if (ModoEdicion($(this))) {
      $(this).find("#bAcep").click(); //acepta edición
    }
    var $cols = $(this).find("td"); //lee campos
    datFil = "";
    $cols.each(function () {
      if ($(this).attr("name") == "buttons") {
        //Es columna de botones
      } else {
        datFil = datFil + $(this).html() + separator;
      }
    });
    if (datFil != "") {
      datFil = datFil.substr(0, datFil.length - separator.length);
    }
    tmp = tmp + datFil + "\n";
  });
  return tmp;
}
