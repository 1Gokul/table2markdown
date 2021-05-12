from flask import (
    Flask,
    render_template,
    redirect,
    url_for,
    request,
    send_from_directory,
)
from flask_jsglue import JSGlue
import shortuuid
import converter

app = Flask(__name__)
jsglue = JSGlue(app)

app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def redirect_to_table_page():
    return redirect(url_for("insert_and_convert", operation="insert"))


@app.route(
    "/insert-and-convert/<operation>",
    methods=["GET", "POST"],
    defaults={"file_id": None},
)
@app.route("/insert-and-convert/<operation>/<file_id>", methods=["GET", "POST"])
def insert_and_convert(operation, file_id):
    if request.method == "POST":

        result_file_id = ""

        # If the table submitted has been made from scratch
        if operation == "insert":
            # Generate an unique filename of the result.
            result_file_id = str(shortuuid.uuid())

        # else if the file_id was used before (eg. converting from CSV to HTML), use that file_id for creating the result files.
        else:
            result_file_id = file_id

        # Calls the convert-table function in converter.py
        response_object = converter.convert_table(request.json, "i2m", result_file_id)
        return response_object

    else:
        if operation == "insert":
            return render_template(
                "insert-table-convert.html",
                title="Insert and Convert",
                shouldLoadTable="false",
            )

        elif operation == "edit-csv":

            file_to_display = open(
                "tmp/Table2Markdown_" + file_id + "_csv_to_html_editable.txt", "r"
            )

            return render_template(
                "insert-table-convert.html",
                title="Convert CSV",
                shouldLoadTable="true",
                tableToLoad=file_to_display.read(),
                fileID=file_id,
            )

        else:
            return render_template(
                "insert-table-convert.html",
                title="Insert and Convert",
                shouldLoadTable="false",
            )


@app.route("/convert-csv-file", methods=["GET", "POST"])
def convert_csv_file():
    if request.method == "POST":

        # The unique filename of the result.
        result_file_id = str(shortuuid.uuid())

        # If the user wishes to only convert the table
        if request.json["convertOption"] == "modify-false":
            # Calls the convert-table function in converter.py, but to convert from csv
            response_object = converter.convert_table(
                request.json["data"], "c2m", result_file_id
            )

        # else if they wish to modify their table before converting
        elif request.json["convertOption"] == "modify-true":
            response_object = converter.csv_to_html(
                request.json["data"], result_file_id
            )

        return response_object

    else:
        return render_template("convertcsv.html", title="Convert CSV")


@app.route("/convert-excel-table", methods=["GET", "POST"])
def convert_excel_table():
    if request.method == "POST":

        # The unique filename of the result.
        result_file_id = str(shortuuid.uuid())

        # Calls the convert-table function in converter.py, but to convert from csv
        response_object = converter.convert_excel(request.json, result_file_id)

        return response_object

    else:
        return render_template("convertexcel.html", title="Convert Excel")


@app.route("/get-table/<view_type>/<path:file_id>")
def get_table(view_type, file_id):

    if view_type == "raw":
        return send_from_directory(
            "tmp",
            "Table2Markdown_" + file_id + ".txt",
            as_attachment=False,
            cache_timeout=0,
        )

    elif view_type == "download":
        return send_from_directory(
            "tmp",
            "Table2Markdown_" + file_id + ".md",
            as_attachment=True,
            cache_timeout=0,
        )

    else:
        return request_page_not_found("bad url")


@app.route("/credits")
def show_credits():
    return render_template("credits.html", title="Credits")


@app.errorhandler(404)
def request_page_not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(threaded=True)
