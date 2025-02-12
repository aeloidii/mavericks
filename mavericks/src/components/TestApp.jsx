import React, { useState } from "react";
import Heading from "./Heading";
import Section from "./Section";
import Button from "./Button";

const TestApp = () => {
  const [predictions, setPredictions] = useState([]);

  const handleButtonClick = async (event) => {
    event.preventDefault();
    try {
      const fileInput = document.getElementById("imageUpload");
      const file = fileInput.files[0];

      if (!file) {
        alert("Please select an image first.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData);
      setPredictions(responseData.Predictions || []);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <Section className="overflow-hidden" id="test-App">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="Test our app" />
        <div className="relative max-w-[60rem] mx-auto mb-12 lg:mb-20 md:text-center">
          <form>
            <div className="flex flex-col md:flex-row justify-center items-center mb-4 gap-3">
              <div className="mb-6">
                <label htmlFor="imageUpload" className="block font-semibold">
                  Choose Image:
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="py-2 px-4 rounded-lg w-full md:w-auto bg-purple-500 text-white"
                />
              </div>
              <Button onClick={handleButtonClick} px="px-3">
                What is the type of this antenna?
              </Button>
            </div>
          </form>
          {predictions.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-100">
              <h3 className="text-lg font-bold text-black">Detection Results:</h3>
              <ul className="mt-2 space-y-2">
                {predictions.map((prediction, index) => (
                  <li key={index} className="p-2 bg-white rounded-lg shadow text-black">
                    <p><strong>Label:</strong> {prediction.label}</p>
                    <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
                    <p><strong>Bounding Box:</strong> [
                      {prediction.bbox.xmin}, {prediction.bbox.ymin},
                      {prediction.bbox.xmax}, {prediction.bbox.ymax}]
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default TestApp;