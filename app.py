from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "project": "AI-SHIELD by OMEGA",
        "description": "AI Agent Security and Governance Platform",
        "status": "Running"
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "message": "AI-SHIELD backend is working!"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)