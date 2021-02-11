from flask import Flask, render_template, redirect, url_for, request, jsonify, send_from_directory
from flask_jsglue import JSGlue
import shortuuid
import converter
import os

app = Flask(__name__)
jsglue = JSGlue(app)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def redirect_to_table_page():
    return redirect(url_for('index'))


@app.route('/table2markdown')
def index():
    return render_template('table2markdown.html')


# Calls the convert-table function in converter.py
@app.route('/convert-table', methods=['POST', 'GET'])
def convert_table():
    if (request.method == "POST"):

        # The unique filename of the result.
        resultFileID = str(shortuuid.uuid())
        responseObject = converter.convert_table(request.json, resultFileID)

        return responseObject


@app.route('/get-table/<viewType>/<path:fileID>')
def get_table(viewType, fileID):

    if (viewType == 'raw'):
        return send_from_directory('tmp',
                                   'Table2Markdown_' + fileID + '.txt',
                                   as_attachment=False,
                                   cache_timeout=0)

    elif (viewType == 'download'):
        return send_from_directory('tmp',
                                   'Table2Markdown_' + fileID + '.md',
                                   as_attachment=True,
                                   cache_timeout=0)

    else:
        return request_page_not_found("bad url")


@app.route('/credits')
def credits():
    return render_template('credits.html')


@app.errorhandler(404)
def request_page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
