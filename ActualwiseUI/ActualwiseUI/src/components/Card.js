import React from "react";
import "./Card.css";
import CardItem from "./CardItem";
import image3 from "../images/image3.jpg";
import image2 from "../images/image2.jpg";

function Cards() {
  return (
    <div className="cards">
      <h1>
        <center>What We Do</center>
      </h1>
      <p>
        At ActualWise, we specialize in transforming old handwritten and typed
        medical notes into a digital format that is easily accessible and highly
        actionable. Our advanced AI technology reads your historical medical
        documentation, extracts valuable information, and digitizes it into a
        structured data format. From there, our system performs thorough
        analysis, enabling you to access in-depth insights about your patients.
      </p>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src={image2}
              text="Simply upload your old medical notes to our secure platform. We accept handwritten notes, scanned documents, and typed records.Our proprietary AI technology reads the medical notes, extracts key information, and converts them into a structured digital format. This includes important details like patient history, diagnoses, prescriptions, and lab results.With ActualWise, you can effortlessly bring your patient records into the digital age, harness the power of AI for diagnostics, and deliver better care with data-driven insights."
              path="/services"
            />
            <CardItem
              src={image3}
              text="Once digitized, the AI analyzes the data to identify patterns, flag potential health risks, and generate detailed insights. It can answer diagnostic questions about the patient's history, current condition, and possible treatment options, providing a deeper understanding of each case.The AI-generated insights help you make informed decisions quickly. With just a few clicks, you can access detailed reports and data summaries, allowing you to focus on patient care rather than administrative tasks."
              path="/services"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
