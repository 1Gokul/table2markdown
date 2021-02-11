import shutil
"""
Contains the functions that convert the provided HTML text into Markdown-style text.
"""


def convert_table(inputTable, fileID):
    resultTable = ""

    # Add the first row of the input table. It will be treated as the header of the output table.
    resultTable += '|'
    for i in range(len(inputTable[0])):

        # Check for formatting
        inputText = check_for_formatted_text(inputTable[0][i])

        resultTable += (' ' + inputText + ' |')

    resultTable += '\n'

    # Add the hyphens below to make the header
    resultTable += '|'
    for i in range(len(inputTable[0])):
        resultTable += ' :'

        # The number of hyphens to add
        currentColLength = len(inputTable[0][i])
        currentColLength = max(
            3,
            currentColLength)  # 3 is the minimum number of hyphens to be added

        if (currentColLength > 0):

            # Formatting characters are not counted towards the number of hyphens.
            # If bold characters exist
            if ('<b>' in inputTable[0][i]):

                # <b></b>(7 characters) - ****(4 characters) is 3
                currentColLength -= 3

            # If italic characters exist
            if ('<i>' in inputTable[0][i]):
                # <i></i>(7 characters) - **(2 characters) is 5
                currentColLength -= 5

            # If strikethrough characters exist
            if ('<del>' in inputTable[0][i]):

                # <del></del>(11 characters) - ~~~~(4 characters) is 7
                currentColLength -= 7

        for j in range(currentColLength):
            resultTable += '-'

        resultTable += ': |'

    resultTable += '\n'

    # Add the contents of the table's body
    for i in range(1, len(inputTable)):
        resultTable += '|'
        for j in range(len(inputTable[i])):

            # Check for formatting
            inputText = check_for_formatted_text(inputTable[i][j])

            resultTable += (" " + inputText + " |")
        resultTable += '\n'

    # Write the results to a file
    write_result_to_file(resultTable, fileID)

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
def write_result_to_file(resultFile, fileID):

    # Used to display the raw result.
    with open("tmp/Table2Markdown_" + fileID + '.txt', "w") as text_file:
        print(f"{resultFile}", file=text_file)

    # If the user wishes to download, copy the contents of the .txt file to a .md file with the same ID.
    shutil.copyfile("tmp/Table2Markdown_" + fileID + '.txt',
                    "tmp/Table2Markdown_" + fileID + '.md')
