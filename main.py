from flask import Flask, render_template, redirect, url_for, request, jsonify, send_file
from flask_jsglue import JSGlue
import shortuuid
import converter
import os

app = Flask(__name__)
jsglue = JSGlue(app)

# Class that holds the unique filename of the result.
class toMarkdownMain:
    resultFilename = 'ToMarkdownTable_' + str(shortuuid.uuid())
    pass

@app.route('/')
def redirect_to_table_page():
    return redirect(url_for('index'))

@app.route('/table2markdown')
def index():
    return render_template('table2markdown.html')

# Calls the convert-table function in converter.py
@app.route('/convert-table', methods=['POST', 'GET'])
def convert_table():
    if(request.method == "POST"):

        responseObject = converter.convert_table(request.json, toMarkdownMain.resultFilename)       

        return responseObject

@app.route('/get-table/<type>')
def get_table(type):
    if(type == 'raw'):
        filename = os.path.join(app.root_path, 'tmp', toMarkdownMain.resultFilename + '.txt')
        return send_file(filename, as_attachment=False)
    elif(type == 'download'):
        filename = os.path.join(app.root_path, 'tmp', toMarkdownMain.resultFilename + '.md')
        return send_file(filename, as_attachment= True)
    else:
        return request_page_not_found("bad url")

@app.errorhandler(404)
def request_page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, threaded=True)    