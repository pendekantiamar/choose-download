// src/components/FileUpload.js
import React, { useState } from "react";
import axios from "axios";

const Files = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("File uploaded successfully");
        setUploadedFileName(response.data.filename); // Save the new filename
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleDownload = async () => {
    if (uploadedFileName) {
      // Use the new filename
      try {
        const response = await axios.get(
          `http://localhost:3000/download/${uploadedFileName}`,
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", selectedFile.name);

        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div>
          <p>{selectedFile.name}</p>
          <button onClick={handleUpload}>Upload</button>
          <button onClick={handleDownload} disabled={!uploadedFileName}>
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default Files;
