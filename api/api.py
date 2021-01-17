import time
from flask import request, Flask, make_response, jsonify

app = Flask(__name__)

@app.route('/api/test', methods = ['POST'])
def test():
	print(request.get_json())
	outputText = request.get_json()["inputLinkData"] + "LINK.ics"
	outputText2 = outputText + "two.ics"
	return {"output" : [outputText, outputText2]}
