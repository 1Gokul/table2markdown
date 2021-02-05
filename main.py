from flask import Flask, render_template, redirect, url_for, request, jsonify, send_file
from flask_jsglue import JSGlue
import converter
import os

app = Flask(__name__)
jsglue = JSGlue(app)

@app.route('/')
def redirect_to_table_page():
    return redirect(url_for('index'))

@app.route('/table2markdown')
def index():
    return render_template('table2markdown.html')

@app.route('/convert-table', methods=['POST', 'GET'])
def convert_table():
    if(request.method == "POST"):
        responseObject = converter.convert_table(request.json)       

        return responseObject

@app.route('/get-table/<type>')
def get_table(type):
    filename = os.path.join(app.root_path, 'tmp', 'ConvertedTable.md')
    return send_file(filename, as_attachment= True if type=='download' else False)

@app.errorhandler(404)
def request_page_not_found(error):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True, threaded=True)    