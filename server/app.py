import os
from flask import Flask, render_template, request, jsonify
import cv2
import functions
from flask_cors import CORS

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
app = Flask(__name__)
CORS(app)

@app.route("/submit", methods=['POST'])
def get_output():
    if request.method == 'POST':
        img = request.files['image']
        print(img)
        img_path = "C:\\Users\\ABDESSAMAD EL OIDII\\Downloads\\GITHUB\\interface_AUTOCAD\\server\\static\\" + img.filename 
        img.save(img_path)
        img_cv2 = cv2.imread(img_path)
        img_cv2 = cv2.resize(img_cv2, (416,416))
        label, bbox, confidence = functions.yolo(img_path)
        print(label)
        return jsonify({'Predictions': label, 'img_name': img.filename})

if __name__ == '__main__':
    app.run(debug=True)
