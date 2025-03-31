from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/check', methods=['POST'])
def check():
    data = request.json
    headers = {
        'origin': 'https://jup.ag',
        'Content-Type': 'application/json'
    }
    resp = requests.post(
        'https://mercuria-fronten-1cd8.mainnet.rpcpool.com/',
        json=data,
        headers=headers
    )
    return jsonify(resp.json())

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
