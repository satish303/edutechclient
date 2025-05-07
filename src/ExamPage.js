import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';


import { startExamAPI, submitExamAPI, terminateExamAPI } from './api';

const ExamPage = () => {
  const videoRef = useRef(null);
  const [warnings, setWarnings] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access is required to start the exam.");
      }
    };
    

    loadModels().then(startCamera);
  }, []);
  const startExam = async () => {
    if (!videoRef.current) {
      alert("Camera not ready.");
      return;
    }
  
    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
  
    if (detections.length !== 1) {
      alert("Please ensure only your face is visible in the camera to begin the exam.");
      return;
    }
  
    await startExamAPI();
    setExamStarted(true);
    setInterval(checkFace, 1000);
  };
  

  const checkFace = async () => {
    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

    if (detections.length > 1) {
      alert("Unauthorized person detected in the background.");
      await terminateExamAPI();
      window.location.reload();
    } else if (detections.length === 1) {
      const nose = detections[0].landmarks.getNose();
      const x = nose[3].x;
      const y = nose[3].y;

      // rudimentary movement check
      if (Math.abs(x - 250) > 50 || Math.abs(y - 150) > 50) {
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        alert(`You are not allowed to move your face. Warning ${newWarnings}`);

        if (newWarnings >= 5) {
          alert("You have exceeded the allowed face movement limit. The exam is now terminated.");
          await terminateExamAPI();
          window.location.reload();
        }
      }
    }
  };

  const handleSubmit = async () => {
    await submitExamAPI({
      is_completed: true,
      completed_assessment: [
        {
          question: "Sample question?",
          submitted_answer: "Sample answer",
          marks: 5,
        },
      ],
    });
    alert("Exam submitted successfully.");
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Proctoring Exam System</h2>
      <video ref={videoRef} autoPlay muted width="400" height="300" style={{ border: '1px solid black' }} />
      <div style={{ marginTop: 20 }}>
        {!examStarted ? (
          <button onClick={startExam}>Start Exam</button>
        ) : (
          <button onClick={handleSubmit}>Submit Exam</button>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
