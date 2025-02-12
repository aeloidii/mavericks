import os
import functions
import cv2
from flask import Flask, jsonify, request , send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'C:\\Users\ABDESSAMAD EL OIDII\\Downloads\\GITHUB\\mavericks\\server\\uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/submit", methods=['POST'])
def get_output():
    if request.method == 'POST':
        img = request.files['image']
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(img.filename))
        img.save(img_path)
        img_cv2 = cv2.imread(img_path)
        img_cv2 = cv2.resize(img_cv2, (416, 416))
        label, bbox, confidence = functions.yolo(img_path)

        print(label)
        print(bbox)
        print(confidence)
        
        # Convert lists into a structured JSON format
        predictions = []
        for i in range(len(label)):
            predictions.append({
                'label': label[i],
                'bbox': {
                    'xmin': bbox[i][0],
                    'ymin': bbox[i][1],
                    'xmax': bbox[i][2],
                    'ymax': bbox[i][3]
                },
                'confidence': confidence[i]
            })

        response = {
            'Predictions': predictions,
            'img_name': img.filename
        }

        # Check if the detected object is a microwave
        if any(entry['label'].lower() == "microwave" for entry in predictions):
            print("Generating AutoLISP script...")
            autolisp_filename = generate_parabolic_antenna_script()
            dwg_filename = os.path.join(app.config['UPLOAD_FOLDER'], "Parabolic_Antenna.dwg")
            
            response.update({
                'autolisp_filename': autolisp_filename,
                'dwg_filename': dwg_filename
            })

        return jsonify(response)


@app.route("/get-autolisp", methods=['GET'])
def get_autolisp():
    autolisp_file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'generated_script.lsp')
    if os.path.exists(autolisp_file_path):
        print("exists.......")
        try:
            with open(autolisp_file_path, 'r') as file:
                autolisp_content = file.read()
            return autolisp_content, 200, {'Content-Type': 'text/plain'}
        except Exception as e:
            print(f"Error getting AutoLISP script: {str(e)}")
            return "Error getting AutoLISP script", 500, {'Content-Type': 'text/plain'}
    else:
        return "AutoLISP script not found", 404, {'Content-Type': 'text/plain'}
    

@app.route("/download-dwg", methods=['GET'])
def download_dwg():
    filename = request.args.get('filename')
    dwg_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(dwg_file_path):
        try:
            return send_file(dwg_file_path, as_attachment=True)
        except Exception as e:
            print(f"Error downloading DWG file: {str(e)}")
            return "Error downloading DWG file", 500, {'Content-Type': 'text/plain'}
    else:
        return "DWG file not found", 404, {'Content-Type': 'text/plain'}

def generate_parabolic_antenna_script():
    autolisp_template = """
    (defun c:CreateParabolicAntenna ()
        ; Define values for the parabolic antenna
        (setq basePoint '(10.0 10.0 0.0)) ; Replace with your desired base point (X, Y, Z)
        (setq dishHeight 5.0) ; Replace with the height of the dish
        (setq dishRadius 8.0) ; Replace with the radius of the dish
        (setq focalLength 6.0) ; Replace with the focal length of the parabolic dish

        ; Calculate the focal point based on the base point and focal length
        (setq focalPoint (list (nth 0 basePoint) (nth 1 basePoint) (+ (nth 2 basePoint) focalLength)))
        (command "_CIRCLE" Center (0 0) Radius 100)
        (command "_TRIM" Entity (entsel) First (entsel) Second (entsel))
        (command "_CIRCLE" Center (0 0) Radius 50)
        (command "_TRIM" Entity (entsel) First (entsel) Second (entsel))
        (command "_RECTANGLE" First (-50 50) Second (50 -50))
        (command "_RECTANGLE" First (-50 50) Second (50 -50))
        (command "_EXTEND" Entity (entsel) Second (entsel) Third (list (getpoint "\nSpecify endpoint of extension line: "))
        (command "_EXTEND" Entity (entsel) Second (entsel) Third (list (getpoint "\nSpecify endpoint of extension line: ")))
        (command "_CIRCLE" Center (0 0) Radius 2)

        ; Draw the parabolic dish as a 3D solid (SURFACE)
        (command "SOLIDSURF" "REVOLVE" "PARABOLA" "YES" basePoint dishRadius "NO" "360" "")

        ; Draw a line representing the feed antenna at the focal point
        (command "LINE" focalPoint focalPoint "")

        ; Save the drawing (optional)
        (command "SAVEAS" "ParabolicAntennaDrawing" "DWG")

        ; Close AutoCAD (optional)
        (command "QUIT" "Y")
    )

    ; Run the script immediately upon loading
    (c:CreateParabolicAntenna)
    """
    autolisp_filename = 'generated_script.lsp'
    with open(os.path.join(app.config['UPLOAD_FOLDER'], autolisp_filename), 'w') as file:
        file.write(autolisp_template)
    return autolisp_filename

if __name__ == '__main__':
    app.run(debug=True)