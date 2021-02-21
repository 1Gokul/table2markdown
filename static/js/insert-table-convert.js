$(document).ready(function () {

	// Global variables
	var selectedCell = "none",
		selectedCellX = 0,
		selectedCellY = 0,
		IsEditing = false;

	// Hide the Accept and Cancel buttons. These buttons appear only when a cell is being edited.
	move_selected_cell();
	$(".bAcep, .bCanc, .editing-key").hide(200, "linear");
	$(".undo, .redo").prop("disabled", true);
	$(".redo-key, .undo-key").addClass('grey-out');

	var actionHistory = [$('#input-table').html()],
		historyPosition = 0;
	// Makes the table editable. (from bootstable.js)
	$("#input-table").SetEditable({
		// Execute when a row is added
		onAdd: function () {
			set_table_row_numbers();
		},
		// Execute when a row is deleted
		onDelete: function () {
			// Reset the selectedCell
			selectedCell = "none";

			set_table_row_numbers();
		},
	});

	// Sets the row numbers. Usually called when a row is added or deleted.
	function set_table_row_numbers() {
		$("#input-table tbody>tr>th").each(function (rowIndex) {
			$(this).html(++rowIndex);
		});
	}
	// Sets the column numbers. Usually called when a column is added or deleted.
	function set_table_column_numbers() {
		// Find the table headers
		var $cols = $("#input-table > thead > tr").find("th");

		// Iterate through the headers
		$cols.each(function (colIndex, el) {
			// The first column's header is '#'
			if (colIndex == 0) {
				$(this).replaceWith('<th scope="col" style="width:10px">#</th>');
			} else {
				$(this).replaceWith('<th scope="col">' + colIndex + "</th>");
			}
		});
	}

	// Creates the row to be added
	function create_row() {
		// Get the input table
		var $tab_en_edic = $("#input-table");

		// Find the rows and columns
		var $row = $tab_en_edic.find("thead tr");
		var $cols = $row.find("th");

		var htmlDat = "";
		// Iterate through each column of the selectedCell's row and set them up to be editable.
		$cols.each(function (colIndex, el) {
			if ($(this).attr("name") == "buttons") {
				//Es columna de botones
				htmlDat = htmlDat + colEdicHtml;
			} else {
				if (colIndex == 0) {
					htmlDat += '<th scope="row"></th>';
				} else {
					htmlDat = htmlDat + "<td></td>";
				}
			}
		});

		return htmlDat;
	}

	// If a cell is currently active, activate the buttons on the table-options menu.
	function select_cell(TypeOfDeletion = "none") {
		// If the selected cell exists, update its position.
		if (selectedCell != "none") {
			// Hightlight the new cell
			$(selectedCell).addClass("selectedCell");
			selectedCellX = selectedCell.cellIndex;
			selectedCellY = selectedCell.parentNode.rowIndex;
		} else {
			// If this function was called after a column was deleted,
			// first check if the current cell can be selected.
			// if not, check the ones on the left and right.
			if (TypeOfDeletion === "col") {
				var found = false;
				$("#input-table > tbody > tr").each(function (rowIndex, row) {
					if (rowIndex + 1 === selectedCellY) {
						$(row)
							.find("td")
							.each(function (j, cell) {
								if (
									j === selectedCellX ||
									j + 1 === selectedCellX ||
									j + 2 === selectedCellX
								) {
									if ($(cell).length) {
										selectedCell = cell;

										select_cell();

										found = true;

										return false;
									}
								}
							});
					}

					if (found === true) return false;
				});
			}

			// If this function was called after a row was deleted,
			// first check if the current cell can be selected.
			// if not, check the ones above and below.
			else if (TypeOfDeletion === "row") {
				var found = false;
				$("#input-table > tbody > tr").each(function (rowIndex, row) {
					if (
						rowIndex === selectedCellY ||
						rowIndex + 1 === selectedCellY ||
						rowIndex + 2 === selectedCellY
					) {
						$(row)
							.find("td")
							.each(function (colIndex, cell) {
								if (colIndex + 1 === selectedCellX) {
									if ($(cell).length) {
										selectedCell = cell;
										//.log("[" + (rowIndex + 1) + "][" + (colIndex + 1) + "]");
										select_cell();
										found = true;
										return false;
									}
								}
							});
					}

					if (found === true) return false;
				});
			}

		}

		$(
			".column-menu > button,.row-menu > button,.text-menu > button"
		).removeAttr("disabled");
		$(".keyboard-nav > div").not('.undo-key, .redo-key').removeClass("grey-out");
		// $(".cell-position > h4").remove();
		// $(".cell-position").append('<h4>[' + selectedCellX + '][' + selectedCellY + ']</h4>');
	}

	// Deactivate the buttons on the table-options menu once a cell is deselected.
	function deselect_cell() {
		// Remove the highlight from the selectedCell
		$(selectedCell).removeClass("selectedCell");
		selectedCell = "none";
		$(".column-menu > button,.row-menu > button,.text-menu > button").attr(
			"disabled",
			"disabled",
			"disabled"
		);
		// $(".cell-position > h4").remove();
		// $(".cell-position").append('<h4>[-][-]</h4>');
		selectedCellX = 0;
		selectedCellY = 0;
		$(".keyboard-nav > div").not(".movement-key, .undo-key, .redo-key").addClass("grey-out");
	}

	function move_selected_cell(direction) {
		console.log("You were at: [" + selectedCellY + "][" + selectedCellX + "]");
		// If moving the cell would push it out of bounds, return.

		if (selectedCell === "none") {
			selectedCellY = 1;
			selectedCellX = 1;
		} else if (goes_out_of_bounds(direction)) {
			console.log("No can do! Going out of bounds there.");
			return false;
		} else {
			if (direction === "up") selectedCellY -= 1;
			else if (direction === "left") selectedCellX -= 1;
			else if (direction === "down") selectedCellY += 1;
			else if (direction === "right") selectedCellX += 1;
		}

		console.log("You have gone to: [" + selectedCellY + "][" + selectedCellX + "]");

		var found = false;
		$("#input-table > tbody > tr").each(function (rowIndex, row) {
			if (rowIndex + 1 === selectedCellY) {
				$(row)
					.find("td")
					.each(function (colIndex, cell) {
						if (colIndex + 1 === selectedCellX) {
							if ($(cell).length) {
								deselect_cell();
								selectedCell = cell;
								found = true;
								return false;
							} else {
								console.log("No element");
							}
						}
					});
			}

			if (found === true) return false;
		});

		select_cell();
	}

	function goes_out_of_bounds(direction) {
		var numberOfRows = $("#input-table > tbody > tr").length;
		var numberOfColumns = $("#input-table > thead > tr > th").length - 1; // -1 for the number-line column

		if (direction === "up") {
			return selectedCellY === 1;
		} else if (direction === "left") {
			return selectedCellX === 1;
		} else if (direction === "down") {
			return selectedCellY === numberOfRows;
		} else if (direction === "right") {
			return selectedCellX === numberOfColumns;
		}
	}

	// Display the result of the conversion to the user.
	function display_result_table(responseObject) {
		// If there were any previously existing results, remove them.
		$("#result-container").remove();
		$("#result-rule").remove();

		//console.log('{{ shouldLoadTable }}');
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

		$(html).insertAfter("#input-table-card");

		window.scrollTo(0, $("hr").offset().top);
	}

	// When a table's row is selected.
	$(document).on("click", "#input-table > tbody > tr > td", function (el) {
		// row was clicked

		if (!IsEditing && selectedCell != el.target) {
			// Remove the highlight of the previously selected cell
			$(selectedCell).removeClass("selectedCell");
			// Assign the new cell
			selectedCell = el.target;
			select_cell();
		}

	});

	// Custom function to add a row above the clicked button's row.
	function add_row_up() {
		// Create the row
		rowData = create_row();

		// Add the row above the current one
		$("<tr>" + rowData + "</tr>").insertBefore(selectedCell.closest("tr"));
		set_table_row_numbers();

		// Update the new position of the selected cell.
		select_cell();

		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	// Custom function to add a row below the clicked button's row.
	function add_row_down() {
		// Create the row
		rowData = create_row();

		// If the length of the table is zero, add the row at the beginning.
		if ($("#input-table > tbody > tr").length <= 0) {
			$($("#input-table").find("tbody")).append("<tr>" + rowData + "</tr>");

			// Unhide the Elim, Edit and AddRowUp buttons.
			$(".bElim, .bEdit, .bAddRowUp").show(200, "linear");

			$(".keyboard-nav > div").show(200, "linear");
			$(".editing-key").hide(200, "linear");

			// Enable the generate-table button.
			$(".generate-table-button > button").prop("disabled", false);

			// Select the first cell in the table
			move_selected_cell("down");
		}

		// Else add the row below the current one
		else {
			$("<tr>" + rowData + "</tr>").insertAfter(selectedCell.closest("tr"));
		}

		set_table_row_numbers();

		// Update the new position of the selected cell.
		select_cell();
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	// Adds a column to the left of the current column.
	function add_column_left() {
		// Add a header cell before the selected cell's header, thus forming a column.
		$("#input-table thead tr th").each(function (colIndex, el) {
			if (colIndex == selectedCellX) {
				$('<th scope="col">' + colIndex + "</th>").insertBefore(el);
			}
		});

		// Add the cells beneath the newly formed column.
		$("#input-table tbody tr").each(function () {
			var $cols = $(this).find("td");
			$cols.each(function (colIndex, el) {
				if (colIndex + 1 == selectedCellX) {
					$("<td></td>").insertBefore(el);
					return false;
				}
			});
		});

		set_table_column_numbers();

		// Update the new position of the selected cell.
		select_cell();
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	function add_column_right() {

		// If there are no columns currently
		if ($("#input-table > thead > tr > th").length === 1) {
			// Append a column header with the value 1
			$("#input-table > thead > tr").append('<th scope="col">' + 1 + "</th>");

			// Append table cells to each row
			$("#input-table tbody tr").each(function () {
				$(this).append("<td></td>");
			});

			// Now that there is one column, unhide the AddColumnLeft, DeleteColumn buttons.
			$(".bAddColumnLeft, .bDeleteColumn").show(200, "linear");

			$(".keyboard-nav > div").show(200, "linear");
			$(".editing-key").hide(200, "linear");

			// Enable the generate-table button
			$(".generate-table-button > button").prop("disabled", false);

			// Select the first cell in the table
			move_selected_cell("right");
		}

		// else if there were columns
		else {
			// Add a header cell after the selected cell's header, thus forming a column.
			$("#input-table thead tr th").each(function (colIndex, el) {
				if (colIndex == selectedCellX) {
					$('<th scope="col">' + colIndex + "</th>").insertAfter(el);
				}
			});

			// Add the cells beneath the newly formed column.
			$("#input-table tbody tr").each(function () {
				var $cols = $(this).find("td");
				$cols.each(function (colIndex, el) {
					if (colIndex + 1 == selectedCellX) {
						$("<td></td>").insertAfter(el);
						return false;
					}
				});
			});

			// Update the new position of the selected cell.
			select_cell();
		}

		set_table_column_numbers();
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	function edit_row() {
		IsEditing = true;
		$(
			".generate-table-button > button, .text-menu > button, .column-menu > button"
		).attr("disabled", "disabled", "disabled");

		// Keyboard keys
		$(".keyboard-nav > div").hide(200, "linear");
		$(".editing-key").show(200, "linear");

		rowEdit(selectedCell);

		// Focus on the text boxes created
		$(selectedCell).find('input').focus();
	}

	function accept_changes() {
		rowAcep(selectedCell);
		$(
			".generate-table-button > button, .text-menu > button, .column-menu > button"
		).removeAttr("disabled");

		// Keyboard keys
		$(".keyboard-nav > div").show(200, "linear");
		$(".editing-key").hide(200, "linear");

		IsEditing = false;
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	// Generates the table with the current data
	function generate_table() {
		var resultArray = new Array();

		// Loop through each row
		$("#input-table > tbody > tr").each(function () {
			// Temporary inner array
			var innerArray = new Array();

			// Add the data of each element to innerArray
			$(this)
				.find("td")
				.each(function () {
					var ele = $(this).html();

					// If the cell is blank, add a hyphen
					if (ele === "")
						innerArray.push("-");
					else
						innerArray.push(ele);
				});
			resultArray.push(innerArray);
		});

		// Convert the array into JSON
		var js_data = JSON.stringify(resultArray);



		// If the current table is from an uploaded csv file, use the same fileID as the filenames of the result files.
		var op = "none",
			fID = "none";

		if (shouldLoadTable === 'true') {
			op = 'edit-csv';
			fID = fileID;
		} else {
			op = 'insert';
		}

		// Send to the view function
		$.ajax({
				type: "POST",
				url: Flask.url_for("insert_and_convert", {
					"operation": op,
					"fileID": fID
				}),
				data: js_data,
				processData: false,
				contentType: "application/json",
				dataType: "json",
			})
			.done((response) => {
				//console.log("Done!");
				display_result_table(response);
			})
			.fail((error) => {
				console.log("Error during file convert: " + error);
			});
	}

	// Makes the text in the selectedCell strikethrough.
	function make_text_strikethrough() {
		var currentContents = $(selectedCell).html();

		if (currentContents != "" && !currentContents.includes("<del>")) {
			var newContents = "<del>" + currentContents + "</del>";
			$(selectedCell).html(newContents);
		}
	}


	// Makes the text in the selectedCell italic.
	function make_text_italic() {
		var currentContents = $(selectedCell).html();

		if (currentContents != "" && !currentContents.includes("<i>")) {
			var newContents = "<i>" + currentContents + "</i>";
			$(selectedCell).html(newContents);
		}
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	// Makes the text in the selectedCell bold.
	function make_text_bold() {
		var currentContents = $(selectedCell).html();

		if (currentContents != "" && !currentContents.includes("<b>")) {
			var newContents = "<b>" + currentContents + "</b>";
			$(selectedCell).html(newContents);
		}
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	function delete_row() {
		rowElim(selectedCell);

		// If there are no rows left,
		// Hide the edit, delete and add row buttons.
		if ($("#input-table > tbody > tr").length <= 0) {
			deselect_cell();
			$(".bElim, .bEdit, .bAddRowUp").hide(200, "linear");
			$(".row-menu > button").removeAttr("disabled");
			$(".generate-table-button > button").prop("disabled", true);

			hide_all_keys_but('T', "Add Row Below");
			$(".keyboard-nav > div").not('.undo-key, .redo-key').removeClass("grey-out");
		}

		// Else if there are rows left, select the closest cell.
		else {
			select_cell("row");
		}
		// Add to the user's history of actions. Will be used for undoing and redoing actions.
		add_to_history();
	}

	function cancel_changes() {
		rowCancel(selectedCell);
		$(
			".generate-table-button > button, .text-menu > button, .column-menu > button"
		).removeAttr("disabled");

		// Keyboard keys
		$(".keyboard-nav > div").show(200, "linear");
		$(".editing-key").hide(200, "linear");

		IsEditing = false;
	}

	function hide_all_keys_but(keyNames, keyDescriptions) {
		$(".keyboard-nav .key-description").each(function () {
			//console.log($(this).text());
			if (keyDescriptions.indexOf($(this).text()) === -1) {
				$(this).hide(200, "linear");
			}
		});

		$(".keyboard-nav .key-name").each(function () {
			// console.log($(this).text());
			if (keyNames.indexOf($(this).text()) === -1) {
				$(this).hide(200, "linear");
			}
		});
	}
	// Deletes the selectedCell's column
	function delete_column() {
		$("#input-table thead tr th").each(function (colIndex, el) {
			if (colIndex == selectedCellX) {
				el.remove();
			}
		});

		// Find and delete the cells of the column
		$("#input-table tbody tr").each(function () {
			var $cols = $(this).find("td");
			$cols.each(function (colIndex, el) {
				if (colIndex + 1 == selectedCellX) {
					el.remove();
					return false;
				}
			});
		});

		// If there are no more columns left, hide the AddColumnLeft, DeleteColumn buttons
		// while keeping the AddColumnRight button visible and enabled.
		if ($("#input-table > thead > tr > th").length === 1) {
			deselect_cell();
			$(".bAddColumnLeft, .bDeleteColumn").hide(200, "linear");
			$(".generate-table-button > button").prop("disabled", true);
			$(".column-menu > button").removeAttr("disabled");

			hide_all_keys_but('X', 'Add Col Right');
			$(".keyboard-nav > div").not('.undo-key, .redo-key').removeClass("grey-out");
		}
		// Else if there are columns left,  select the closest cell.
		else {
			// Reset the selectedCell
			selectedCell = "none";
			select_cell("col");
		}

		set_table_column_numbers();
	}





	$(document).on("click", ".undo", undo_action);
	$(document).on("click", ".redo", redo_action);


	$(document).on("click", ".bAddRowUp", add_row_up);


	$(document).on("click", ".bAddRowDown", add_row_down);


	$(document).on("click", ".bAddColumnLeft", add_column_left);


	$(document).on("click", ".bAddColumnRight", add_column_right);


	$(document).on("click", ".bDeleteColumn", delete_column);



	$(document).on("click", ".bEdit", edit_row);
	$(document).on("click", ".bAcep", accept_changes);


	$(document).on("click", ".bCanc", cancel_changes);

	$(document).on("click", ".bElim", delete_row);


	$(document).on("click", ".make-bold", make_text_bold);

	$(document).on("click", ".make-italic", make_text_italic);


	$(document).on("click", ".make-strikethrough", make_text_strikethrough);


	$(document).on("click", ".bGenerateTable", generate_table);

	$(this).keypress(function (event) {

		if (!IsEditing) {

			if (selectedCell != "none") {
				switch (event.code) {
					case "KeyW":
						move_selected_cell("up");
						break;
					case "KeyA":
						move_selected_cell("left");
						break;
					case "KeyS":
						move_selected_cell("down");
						break;
					case "KeyD":
						move_selected_cell("right");
						break;
					case "KeyU":
						move_selected_cell("right");
						break;

					case "KeyI":

						break;
					case "KeyB":

						break;
					case "KeyN":
						make_text_italic();
						break;
					case "KeyM":
						make_text_strikethrough();
						break;
					case "KeyZ":
						add_column_left();
						break;
					case "KeyC":
						delete_column();
						break;
					case "KeyE":
						edit_row();
						break;
					case "KeyR":
						add_row_up();
						break;
					case "KeyY":
						delete_row();
						break;
					case "KeyG":
						generate_table();
						break;
					case "KeyX":
						add_column_right();
						break;
					case "KeyT":
						add_row_down();
						break;
					default:
						break;
				}
			} else {
				switch (event.code) {
					case "KeyG":
						generate_table();
						break;
					case "KeyX":
						add_column_right();
						break;
					case "KeyT":
						add_row_down();
						break;
					default:
						break;
				}
			}

		} else {
			switch (event.code) {
				case "KeyJ":
					accept_changes();;
					break;
				case "KeyK":
					cancel_changes();
					break;
				default:
					break;
			}
		}
	});

	function add_to_history() {

		// If the maximum number of history entries have been saved, remove the oldest entry.
		if (actionHistory.length === 10) {
			actionHistory.shift();
		}

		// Remove the history after the current historyPosition
		let amountToPop = actionHistory.length - historyPosition - 1;

		for (let index = 0; index < amountToPop; index++) {
			actionHistory.pop();
		}

		var html = $('#input-table').html() //.replace('selectedCell', '');
		// Save the current state of the array
		actionHistory.push(html);
		historyPosition = actionHistory.length - 1;

		//console.log("historyPosition " + historyPosition);

		// Enable the undo button while disabling the redo button.
		if ($('.undo').prop('disabled')) {
			$('.undo').prop('disabled', false);
			$('.undo-key').removeClass('grey-out');
		}

		$('.redo').prop('disabled', true);
		$('.redo-key').addClass('grey-out');

	}

	function undo_action() {

		// If there is history that can be shown to the user
		if (historyPosition > 0) {
			// Replace the html inside the table with the next history entry.
			$('#input-table').html('').append(actionHistory[historyPosition - 1]);

			historyPosition -= 1;

			// If there is no more history left to be shown (i.e. if the user has reached the beginning of the actionHistory array)
			// disable the undo button.
			if (historyPosition === 0) {
				$('.undo').prop('disabled', true);
				$('.undo-key').addClass('grey-out');
			}

			// An redos are now possible, enable the redo buttons.
			if ($('.redo').prop('disabled')) {
				$('.redo').prop('disabled', false);
				$('.redo-key').removeClass('grey-out');
			}
		}
		//console.log("historyPosition " + historyPosition);

		set_selected_cell_from_history();
	}

	function redo_action() {

		// If there is history that can be shown to the user
		if (historyPosition < actionHistory.length - 1) {
			// Replace the html inside the table with the next history entry.
			$('#input-table').html('').append(actionHistory[historyPosition + 1]);

			historyPosition += 1;

			// If there is no more history left to be shown (i.e. if the user has reached the beginning of the actionHistory array)
			// disable the redo button.
			if (historyPosition === actionHistory.length - 1) {
				$('.redo').prop('disabled', true);
				$('.redo-key').addClass('grey-out');
			}

			//console.log($('.undo').prop('disabled'));

			// An undos are now possible, enable the undo buttons.
			if ($('.undo').prop('disabled')) {
				$('.undo-key').addClass('grey-out');
				$('.undo').prop('disabled', false);
			}

		}

		//console.log("historyPosition " + historyPosition);
		set_selected_cell_from_history();
	}

	// Finds the selectedCell of the actionHistory element and sets it as the current selectedCell.
	function set_selected_cell_from_history() {
		$("#input-table > tbody > tr > td").each(function (i, cell) {
			if ($(cell).hasClass('selectedCell')) {
				deselect_cell();
				selectedCell = cell;
				return false;
			}
		});
		select_cell();
	}


});