import shutil

"""Contains the functions that convert the provided HTML table, CSV table or Excel table into Markdown-style text."""


# convert_type is either 'i2m'(insertedTable-to-Markdown) or 'c2m'(CSV-to-Markdown).
def convert_table(input_data, convert_type, file_id):
    result_table = ""

    # Add the first row of the input table. It will be treated as the header of the output table.
    result_table += "|"
    for i in range(len(input_data[0])):

        if convert_type == "i2m":
            # If converting from HTML, check for formatting.
            inputText = check_for_formatted_text(input_data[0][i])
            result_table += " " + inputText + " |"
        else:
            result_table += " " + input_data[0][i] + " |"

    result_table += "\n"

    # Add the hyphens below to make the header
    result_table += "|"
    for i in range(len(input_data[0])):
        result_table += " "

        # The number of hyphens to add
        current_column_length = len(input_data[0][i])
        current_column_length = max(
            3, current_column_length
        )  # 3 is the minimum number of hyphens to be added

        if convert_type == "i2m":
            if current_column_length > 0:

                # Formatting characters are not counted towards the number of hyphens.
                # If bold characters exist
                if "<b>" in input_data[0][i]:

                    # <b></b>(7 characters) - ****(4 characters) is 3
                    current_column_length -= 3

                # If italic characters exist
                if "<i>" in input_data[0][i]:
                    # <i></i>(7 characters) - **(2 characters) is 5
                    current_column_length -= 5

                # If strikethrough characters exist
                if "<del>" in input_data[0][i]:

                    # <del></del>(11 characters) - ~~~~(4 characters) is 7
                    current_column_length -= 7

        for j in range(current_column_length):
            result_table += "-"

        result_table += " |"

    result_table += "\n"

    # Add the contents of the table's body
    for i in range(1, len(input_data)):
        result_table += "|"
        for j in range(len(input_data[i])):

            if convert_type == "i2m":
                # If converting from HTML, check for formatting.
                inputText = check_for_formatted_text(input_data[i][j])
                result_table += " " + inputText + " |"
            else:
                result_table += " " + input_data[i][j] + " |"

        result_table += "\n"

    # Write the results to a file
    write_result_to_file(result_table, file_id, also_write_to_md=True)

    response_object = {"resultTable": result_table, "resultFileID": file_id}

    return response_object


# Check for formatted text and change them to Markdown-style formatted text.
# If not formatted, return the original string.
def check_for_formatted_text(inp):
    output = inp

    # If bold
    if "<b>" in inp:
        output = make_bold(output)

    # If italic
    if "<i>" in inp:
        output = make_italic(output)

    # If strikethrough
    if "<del>" in inp:
        output = make_strikethrough(output)

    return output


def make_bold(inp):
    output = inp.replace("<b>", "**")
    output = output.replace("</b>", "**")
    return output


def make_italic(inp):
    output = inp.replace("<i>", "*")
    output = output.replace("</i>", "*")
    return output


def make_strikethrough(inp):
    output = inp.replace("<del>", "~~")
    output = output.replace("</del>", "~~")
    return output


# Writes the result to a file
# Type is 'raw' or 'download'
def write_result_to_file(
    result_file, file_id, filename_suffix="", also_write_to_md=False
):

    # Used to display the raw result.
    with open(
        "tmp/Table2Markdown_" + file_id + filename_suffix + ".txt", "w"
    ) as text_file:
        print(f"{result_file}", file=text_file)

    if also_write_to_md:
        # If the user wishes to download, copy the contents of the .txt file to a .md file with the same ID.
        shutil.copyfile(
            "tmp/Table2Markdown_" + file_id + filename_suffix + ".txt",
            "tmp/Table2Markdown_" + file_id + filename_suffix + ".md",
        )


# Converts the passed CSV file into an HTML table.
# This table will then be shown to the user for further editing.
def csv_to_html(input_file, file_id):

    # Add the header
    result_table = '<thead><tr><th scope="col" style="width:10px">#</th>'

    colCount = 1
    for col in input_file[0]:
        result_table += '<th scope="col">' + str(colCount) + "</th>"
        colCount += 1

    result_table += "</tr></thead>"

    # Add the body
    result_table += "<tbody>"

    row_count = 1
    for row in input_file:
        result_table += '<tr><th scope="row">' + str(row_count) + "</th>"

        for col in row:
            result_table += "<td>" + str(col) + "</td>"

        result_table += "</tr>"
        row_count += 1

    result_table += "</tbody>"

    response_object = {"resultFileID": file_id}

    # Write the result into a .txt file
    write_result_to_file(result_table, file_id, "_csv_to_html_editable", False)

    return response_object


# Parses the passed excel table and puts the content into an array.
# The array is then passed to the convert_table() function.
def convert_excel(input_table, file_id):
    result_table = []
    rows = input_table.split("\n")

    for col in rows:
        cells = col.split("\t")
        result_table.append(cells)

    response_object = convert_table(result_table, "c2m", file_id)

    return response_object
