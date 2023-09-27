import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

function EmotionDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // LOAD FROM USEEFFECT
  useEffect(() => {
    getVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOUR FACE WEBCAM
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // LOAD MODELS FROM FACE API
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceDetect();
    });
  };

  const faceDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      // DRAW YOUR FACE IN CAMERA
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );

      const displaySize = {
        width: videoRef.current.width,
        height: videoRef.current.height,
      };

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );

      faceapi.matchDimensions(canvasRef.current, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      // const context = canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    }, 100);
  };

  return (
    <div>
      <div className="content">
        <video
          ref={videoRef}
          width="720"
          height="560"
          className="bordered-video"
          autoPlay
        ></video>
        <canvas
          ref={canvasRef}
          width="720"
          height="560"
          className="appcanvas"
        />
      </div>
    </div>
  );
}

export default EmotionDetector;
