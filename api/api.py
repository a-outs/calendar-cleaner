import time
from flask import request, Flask, make_response, jsonify

app = Flask(__name__)

@app.route('/api/test', methods = ['POST'])
def test():
	print(request.get_json())
	return request.get_json()
