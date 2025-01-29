import React, { useState, useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import MachineLeft from "../images/image2.jpg";
import "./Order.css";
import { useAuth } from "../AuthContext";
import { uploadFile } from "../S3Uploader.js"; // Assume this is your file upload function

function Order() {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessages, setUploadMessages] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
    setMessage("");
    setUploadMessages([]);
  };

  const handleUpload = async (files) => {
    setIsUploading(true);
    const messages = [];
    for (const file of files) {
      try {
        const data = await uploadFile(file, username); // Replace with username logic if needed
        console.log("Upload success", data);
        messages.push(`${file.name} uploaded successfully!`);
      } catch (err) {
        console.error("Upload error", err);
        messages.push(`${file.name} failed to upload. Error: ${err.message}`);
      }
    }
    setIsUploading(false);
    setUploadMessages(messages);

    // Clear form fields on successful upload
    if (messages.every((msg) => msg.includes("uploaded successfully"))) {
      setSelectedFiles([]);
      setMessage("Files uploaded successfully.");

      // Redirect to FileFetch.js after successful upload
      navigate("/filefetch"); // Modify the path as needed
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to upload a document.");
      return;
    }
    if (selectedFiles.length > 0) {
      handleUpload(selectedFiles);
      setMessage("Files ready to be uploaded.");
    } else {
      alert("Please select files to upload.");
    }
  };

  return (
    <div className="order">
      <div
        className="leftSide"
        style={{ backgroundImage: `url(${MachineLeft})` }}
      ></div>
      <div className="rightSide">
        <h4>Upload Document Here</h4>
        <h7>Please login before you upload the document!</h7>
        <form id="order-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input name="name" placeholder="Enter full name..." type="text" />

          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            placeholder="Enter email address..."
            type="email"
          />

          <label htmlFor="attachment">Attachment</label>
          <input
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            onChange={handleFileChange}
          />

          <label htmlFor="message">Message</label>
          <textarea
            rows="2"
            placeholder="Enter message..."
            name="message"
            required
          ></textarea>

          <button type="submit" disabled={!isAuthenticated || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          {message && <p className="success">{message}</p>}
          {selectedFiles.length > 0 && (
            <div className="file-list">
              <h3>Selected Files:</h3>
              <ul>
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {uploadMessages.length > 0 && (
            <div className="upload-messages">
              {uploadMessages.map((msg, index) => (
                <p
                  key={index}
                  className={msg.includes("successfully") ? "success" : "error"}
                >
                  {msg}
                </p>
              ))}
            </div>
          )}
        </form>
        {!isAuthenticated && (
          <p style={{ color: "red", marginTop: "5px", paddingLeft: "25px" }}>
            You must be logged in to upload a document.
          </p>
        )}
      </div>
    </div>
  );
}

export default Order;
