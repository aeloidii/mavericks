import React, { useState, useEffect } from "react";
import Heading from "./Heading";
import Section from "./Section";
import Button from "./Button";
import axios from "axios";
import { background } from "../assets";

const TestApp = () => {
  const [predictions, setPredictions] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const handleButtonClick = async (event) => {
    event.preventDefault();
  
    try {
      const fileInput = document.getElementById("imageUpload");
      const file = fileInput.files[0];
  
      const formData = new FormData();
      formData.append("image", file);
  
      const response = await fetch("http://127.0.0.1:5000/submit", {
        method: "POST",
        body: formData
      });
  
      const responseData = await response.json();
      console.log(responseData);
      setPredictions(responseData.Predictions); // Store predictions
      setResponseMessage(responseData.img_name);
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
            <div className="md:col-span-1 flex flex-col md:flex-row justify-center md:justify-between items-center mb-4">
              <div className="mb-8">
                <label htmlFor="imageUpload" className="block">
                  Choose Image:&nbsp;
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="py-2 px-4 rounded-lg w-full md:w-auto"
                  style={{
                    backgroundColor: "#ca61ee",
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row">
                <Button
                  px="px-3"
                  className="mb-4 md:mb-0 md:mr-4"
                >
                  Get AutoLISP Script
                </Button>
                <Button onClick={handleButtonClick} px="px-3">What is the type of this antenna?</Button>
              </div>
            </div>
          </form>
          {/* {responseMessage && <p>Image Name: {responseMessage}</p>} */}
          {predictions.length > 0 && (
            <div>
              <p>This antenna contains:</p>
              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index}>{prediction}</li>
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
