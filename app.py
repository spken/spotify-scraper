from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')

@app.route('/')
def start():
    return render_template('pages/index.html')

if __name__ == "__main__":
    app.run()