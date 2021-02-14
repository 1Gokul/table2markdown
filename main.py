from flask import Flask, render_template, redirect, url_for, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_jsglue import JSGlue
import shortuuid
import converter
import os

app = Flask(__name__)
jsglue = JSGlue(app)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def redirect_to_table_page():
    return redirect(url_for('insert_and_convert'))


@app.route('/insert-and-convert', methods=['GET', 'POST'])
def insert_and_convert():
    if (request.method == 'POST'):

        # The unique filename of the result.
        resultFileID = str(shortuuid.uuid())

        # Calls the convert-table function in converter.py
        responseObject = converter.convert_table(request.json, 'i2m', resultFileID)
        return responseObject

    else:
        return render_template('insert-table-convert.html',
                               title="Insert and Convert")


@app.route('/convert-csv-file', methods=['GET', 'POST'])
def convert_csv_file():
    if (request.method == 'POST'):
        
        # The unique filename of the result.
        resultFileID = str(shortuuid.uuid())

        # Calls the convert-table function in converter.py, but to convert from csv
        responseObject = converter.convert_table(request.json, 'c2m', resultFileID)

        return responseObject

    else:
        return render_template('convertcsv.html', title="Convert CSV")


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
    return render_template('credits.html', title="Credits")


@app.errorhandler(404)
def request_page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, threaded=True)
