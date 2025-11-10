import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export const CameraCapture = ({ onCapture, onClose }) => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success('Camera started! Position your bill');
    } catch (error) {
      toast.error('Camera access denied or not available');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
      toast.success('Photo captured! Processing...');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        toast.success('Image uploaded! Processing...');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing (in real implementation, you'd call an API)
    setTimeout(() => {
      // Mock extracted data
      const mockData = {
        billName: 'Electricity Bill',
        amount: Math.floor(Math.random() * 5000) + 500,
        date: new Date().toISOString().split('T')[0],
        category: 'Utilities'
      };
      
      setIsProcessing(false);
      onCapture(mockData);
      toast.success('Bill data extracted successfully!');
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  return (
    <div className="camera-overlay">
      <Card className="camera-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Scan Bill or Receipt</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="camera-container">
            {!stream && !capturedImage && (
              <div className="camera-placeholder">
                <Camera className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Capture or upload a bill/receipt</p>
                <div className="flex gap-3">
                  <Button onClick={startCamera} data-testid="start-camera-btn">
                    <Camera className="h-4 w-4 mr-2" />
                    Open Camera
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('file-upload').click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    data-testid="file-upload-input"
                  />
                </div>
              </div>
            )}

            {stream && (
              <div className="video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-video"
                />
                <div className="camera-controls">
                  <Button onClick={capturePhoto} size="lg" data-testid="capture-btn">
                    <Camera className="h-5 w-5 mr-2" />
                    Capture
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {capturedImage && (
              <div className="preview-container">
                <img src={capturedImage} alt="Captured" className="captured-image" />
                <div className="preview-controls">
                  <Button 
                    onClick={processImage} 
                    disabled={isProcessing}
                    data-testid="process-btn"
                  >
                    {isProcessing ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Extract Data
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setCapturedImage(null)}>
                    Retake
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <div className="camera-tips">
            <h4>Tips for best results:</h4>
            <ul>
              <li>Ensure good lighting</li>
              <li>Keep bill flat and straight</li>
              <li>Include all important details</li>
              <li>Avoid shadows and glare</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};