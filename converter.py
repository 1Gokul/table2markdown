import shutil
"""
Contains the functions that convert the provided HTML table, CSV table or Excel table into Markdown-style text.
"""


# convertType is either 'i2m'(insertedTable-to-Markdown) or 'c2m'(CSV-to-Markdown).
def convert_table(inputData, convertType, fileID):
    resultTable = ""

    # Add the first row of the input table. It will be treated as the header of the output table.
    resultTable += '|'
    for i in range(len(inputData[0])):

        if (convertType == 'i2m'):
            # If converting from HTML, check for formatting.
            inputText = check_for_formatted_text(inputData[0][i])
            resultTable += (' ' + inputText + ' |')
        else:
            resultTable += (' ' + inputData[0][i] + ' |')

    resultTable += '\n'

    # Add the hyphens below to make the header
    resultTable += '|'
    for i in range(len(inputData[0])):
        resultTable += ' '

        # The number of hyphens to add
        currentColLength = len(inputData[0][i])
        currentColLength = max(
            3,
            currentColLength)  # 3 is the minimum number of hyphens to be added

        if (convertType == 'i2m'):
            if (currentColLength > 0):

                # Formatting characters are not counted towards the number of hyphens.
                # If bold characters exist
                if ('<b>' in inputData[0][i]):

                    # <b></b>(7 characters) - ****(4 characters) is 3
                    currentColLength -= 3

                # If italic characters exist
                if ('<i>' in inputData[0][i]):
                    # <i></i>(7 characters) - **(2 characters) is 5
                    currentColLength -= 5

                # If strikethrough characters exist
                if ('<del>' in inputData[0][i]):

                    # <del></del>(11 characters) - ~~~~(4 characters) is 7
                    currentColLength -= 7

        for j in range(currentColLength):
            resultTable += '-'

        resultTable += ' |'

    resultTable += '\n'

    # Add the contents of the table's body
    for i in range(1, len(inputData)):
        resultTable += '|'
        for j in range(len(inputData[i])):

            if (convertType == 'i2m'):
                # If converting from HTML, check for formatting.
                inputText = check_for_formatted_text(inputData[i][j])
                resultTable += (' ' + inputText + ' |')
            else:
                resultTable += (' ' + inputData[i][j] + ' |')

        resultTable += '\n'

    # Write the results to a file
    write_result_to_file(resultTable, fileID, alsoWriteToMD=True)

    responseObject = {"resultTable": resultTable, "resultFileID": fileID}

    return responseObject


# Check for formatted text and change them to Markdown-style formatted text.
# If not formatted, return the original string.
def check_for_formatted_text(inp):
    output = inp

    # If bold
    if ('<b>' in inp):
        output = make_bold(output)

    # If italic
    if ('<i>' in inp):
        output = make_italic(output)

    # If strikethrough
    if ('<del>' in inp):
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
def write_result_to_file(resultFile,
                         fileID,
                         filenameSuffix='',
                         alsoWriteToMD=False):

    # Used to display the raw result.
    with open("tmp/Table2Markdown_" + fileID + filenameSuffix + '.txt',
              "w") as text_file:
        print(f"{resultFile}", file=text_file)

    if (alsoWriteToMD):
        # If the user wishes to download, copy the contents of the .txt file to a .md file with the same ID.
        shutil.copyfile(
            "tmp/Table2Markdown_" + fileID + filenameSuffix + '.txt',
            "tmp/Table2Markdown_" + fileID + filenameSuffix + '.md')


# Converts the passed CSV file into an HTML table.
# This table will then be shown to the user for further editing.
def csv_to_html(inputFile, fileID):

    # Add the header
    resultTable = '<thead><tr><th scope="col" style="width:10px">#</th>'

    colCount = 1
    for col in inputFile[0]:
        resultTable += '<th scope="col">' + str(colCount) + '</th>'
        colCount += 1

    resultTable += '</tr></thead>'

    # Add the body
    resultTable += '<tbody>'

    rowCount = 1
    for row in inputFile:
        resultTable += '<tr><th scope="row">' + str(rowCount) + '</th>'

        for col in row:
            resultTable += '<td>' + str(col) + '</td>'

        resultTable += '</tr>'
        rowCount += 1

    resultTable += '</tbody>'

    responseObject = {"resultFileID": fileID}

    # Write the result into a .txt file
    write_result_to_file(resultTable, fileID, '_csv_to_html_editable', False)

    return responseObject


# Parses the passed excel table and puts the content into an array.
# The array is then passed to the convert_table() function.
def convert_excel(inputTable, fileID):

    # resultTable = '|'
    # currentCell = ''
    # rowIndex = 0

    # # for cell in inputTable:
    # #     headerRow += ' '
    # #     if cell == '\n':
    # #         break
    # #     elif cell == '\t':
    # #         headerRow += ' |'
    # #     else:
    # #         for i in len(cell):
    # #             headerRow += ''

    # for cell in inputTable:

    #     if cell == "\t":
    #         print("Found Blank")
    #         print(currentCell)
    #         currentCell = ''
    #     elif cell == '\n':
    #         print("Found newline")
    #     else:
    #         currentCell += cell
    resultTable = []
    rows = inputTable.split('\n')

    for col in rows:
        cells = col.split('\t')
        resultTable.append(cells)

    responseObject = convert_table(resultTable, 'c2m', fileID)

    return responseObject
