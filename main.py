from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/')
def redirect_to_table_page():
    return redirect(url_for('index'))

@app.route('/table2markdown')
def index():
    return render_template('table2markdown.html')

@app.errorhandler(404)
def request_page_not_found(error):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, threaded=True)    