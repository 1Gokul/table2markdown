import shutil

"""
Contains the functions that convert the provided HTML text into Markdown-style text.
"""

def convert_table(inputTable, filename):
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
        resultTable += ' :---'
        for j in range(len(inputTable[0][i]) - 3):
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

    # Write the result to a .txt file with the provided filename
    with open("tmp/" + filename + '.txt', "w") as text_file:
            print(f"{resultTable}", file=text_file)
    
    shutil.copyfile("tmp/" + filename + '.txt', "tmp/" + filename + '.md')

    responseObject = { "resultTable": resultTable, "resultFileLink": ''}
    return responseObject



# Check for formatted text and change them to Markdown-style formatted text.
# If not formatted, return the original string.
def check_for_formatted_text(inp):
    output = inp

    # If bold
    if('<b>' in inp):
        output = make_bold(output)
    
    # If italic
    if('<i>' in inp):
        output = make_italic(output)

    # If strikethrough
    if('<del>' in inp):
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
    