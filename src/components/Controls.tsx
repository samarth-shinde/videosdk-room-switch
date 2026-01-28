import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const Controls: React.FC = () => {
  const { leave, toggleMic, toggleWebcam, localMicOn, localWebcamOn } = useMeeting();

  return (
    <div className="controls">
      <button
        className={`control-btn ${localMicOn ? "active" : "inactive"}`}
        onClick={() => toggleMic()}
        title={localMicOn ? "Mute Microphone" : "Unmute Microphone"}
      >
        {localMicOn ? "🎤 Mic On" : "🔇 Mic Off"}
      </button>
      <button
        className={`control-btn ${localWebcamOn ? "active" : "inactive"}`}
        onClick={() => toggleWebcam()}
        title={localWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
      >
        {localWebcamOn ? "📹 Cam On" : "📷 Cam Off"}
      </button>
      <button className="control-btn leave-btn" onClick={() => leave()} title="Leave Meeting">
        Leave Room
      </button>
    </div>
  );
};

export default Controls;
