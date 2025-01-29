import React, { useState, useEffect } from "react";
import "./FileFetch.css";
import { listProcessedFiles, getFileDownloadUrl } from "../S3Uploader.js";
import { getCurrentUser } from "aws-amplify/auth"; // Import user fetch logic

function FileFetch() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileLink, setFileLink] = useState("");
  const [username, setUsername] = useState("");

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUsername(user.username); // Set the username for use in file operations
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (isProcessing) {
      const intervalId = setInterval(() => {
        setCurrentStep((prevStep) => (prevStep + 1) % 4); // Loop through steps
      }, 1000); // Update every second

      return () => clearInterval(intervalId);
    }
  }, [isProcessing]);

  const handleButtonClick = async () => {
    if (!username) {
      alert("User information is missing. Please log in.");
      return;
    }

    setIsProcessing(true);
    console.log("Current username:", username);

    try {
      const files = await listProcessedFiles(username);
      if (files.length > 0) {
        const latestFile = files[files.length - 1].Key; // Get the most recent file
        const url = getFileDownloadUrl(latestFile);
        setFileLink(url); // Save the download link
      } else {
        console.log("No files found for the user.");
        alert("No file found ! Still processing !");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("An error occurred while fetching files.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="file-fetch">
      <h2 className="report-heading">Your Report is Getting Generated</h2>
      <div className="process-box">
        <div className="progress-bar">
          <div className={`step ${currentStep === 0 ? "active" : ""}`}>
            <span>Upload File</span>
          </div>
          <div className={`arrow ${currentStep >= 0 ? "active" : ""}`}></div>
          <div className={`step ${currentStep === 1 ? "active" : ""}`}>
            <span>Extracting Medical Details</span>
          </div>
          <div className={`arrow ${currentStep >= 1 ? "active" : ""}`}></div>
          <div className={`step ${currentStep === 2 ? "active" : ""}`}>
            <span>Generating Report</span>
          </div>
          <div className={`arrow ${currentStep >= 2 ? "active" : ""}`}></div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            <span>Fetching the Document</span>
          </div>
        </div>

        <button onClick={handleButtonClick} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Get Your Report"}
        </button>

        {fileLink && (
          <div className="file-link">
            <p>Your report is ready. Click below to download:</p>
            <a href={fileLink} target="_blank" rel="noopener noreferrer">
              Download Report
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileFetch;
