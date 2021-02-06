import shutil

def convert_table(inputTable, filename):
    resultTable = ""

    # Add the first row of the input table. It will be treated as the header of the output table.
    resultTable += '|'
    for i in range(len(inputTable[0])):
        resultTable += (' ' + inputTable[0][i] + ' |')
        
    resultTable += '\n'

    # Add the hyphens to make the header
    resultTable += '|'
    for i in range(len(inputTable[0])):
        resultTable += ' :---'
        for j in range(len(inputTable[0][i]) - 3):
            resultTable += '-'
        resultTable += ': |'
    
    resultTable += '\n'

    for i in range(1, len(inputTable)):
        resultTable += '|'
        for j in range(len(inputTable[i])):
            resultTable += (" " + inputTable[i][j] + " |")
        resultTable += '\n'

    # Write the result to a .txt file with the provided filename
    with open("tmp/" + filename + '.txt', "w") as text_file:
            print(f"{resultTable}", file=text_file)
    
    shutil.copyfile("tmp/" + filename + '.txt', "tmp/" + filename + '.md')

    responseObject = { "resultTable": resultTable, "resultFileLink": ''}
    return responseObject
    