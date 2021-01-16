import time
from flask import request, Flask, make_response, jsonify

app = Flask(__name__)

@app.route('/api/time')
def get_current_time():
	return {'time': time.time()}

@app.route('/api/test', methods = ['POST'])
def test():
	print(request.get_json())
	return {"gay":"bears"}
