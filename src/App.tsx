import React, { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";
import { AUTH_TOKEN } from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState<string>(AUTH_TOKEN);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [roomLabel, setRoomLabel] = useState<string>("Room A");
  const [otherRoomId, setOtherRoomId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isMediaRelaying, setIsMediaRelaying] = useState<boolean>(false);
  const [mediaRelayTarget, setMediaRelayTarget] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [pendingRoom, setPendingRoom] = useState<{
    meetingId: string;
    roomLabel: string;
    otherRoomId: string | null;
  } | null>(null);

  const handleJoinRoom = (
    newMeetingId: string,
    newRoomLabel: string,
    newOtherRoomId: string | null
  ) => {
    setPendingRoom({
      meetingId: newMeetingId,
      roomLabel: newRoomLabel,
      otherRoomId: newOtherRoomId,
    });
    setShowNameInput(true);
  };

  const handleConfirmJoin = () => {
    if (pendingRoom && participantName.trim()) {
      setMeetingId(pendingRoom.meetingId);
      setRoomLabel(pendingRoom.roomLabel);
      setOtherRoomId(pendingRoom.otherRoomId);
      setIsJoined(true);
      setShowNameInput(false);
      setPendingRoom(null);
    }
  };

  const handleSwitchRoom = (newRoomId: string) => {
    setIsMediaRelaying(false);
    setMediaRelayTarget(null);
    setMeetingId(newRoomId);
    setRoomLabel(roomLabel === "Room A" ? "Room B" : "Room A");
    setOtherRoomId(meetingId);
  };

  const handleLeave = () => {
    setMeetingId(null);
    setIsJoined(false);
    setIsMediaRelaying(false);
    setMediaRelayTarget(null);
  };

  const handleMediaRelay = (destinationMeetingId: string) => {
    if (destinationMeetingId) {
      setIsMediaRelaying(true);
      setMediaRelayTarget(destinationMeetingId);
    } else {
      setIsMediaRelaying(false);
      setMediaRelayTarget(null);
    }
  };

  if (token === "YOUR_AUTH_TOKEN_HERE" || !token) {
    return (
      <div className="App">
        <div className="token-screen">
          <h1>VideoSDK Room Switch</h1>
          <p>Enter your VideoSDK token</p>
          <input
            type="text"
            placeholder="Paste token here"
            value={token === "YOUR_AUTH_TOKEN_HERE" ? "" : token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={() => setToken(token)} disabled={!token || token === "YOUR_AUTH_TOKEN_HERE"}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className="App">
        <div className="name-modal">
          <h2>Enter Your Name</h2>
          <input
            type="text"
            placeholder="Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleConfirmJoin()}
          />
          <div className="modal-buttons">
            <button
              className="cancel-btn"
              onClick={() => {
                setShowNameInput(false);
                setPendingRoom(null);
              }}
            >
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleConfirmJoin}
              disabled={!participantName.trim()}
            >
              Join {pendingRoom?.roomLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!isJoined ? (
        <JoinScreen token={token} onJoinRoom={handleJoinRoom} />
      ) : meetingId ? (
        <MeetingProvider
          config={{
            meetingId: meetingId,
            micEnabled: true,
            webcamEnabled: true,
            name: participantName,
            debugMode: false,
          }}
          token={token}
          joinWithoutUserInteraction={true}
          key={meetingId}
        >
          <MeetingView
            meetingId={meetingId}
            roomLabel={roomLabel}
            otherRoomId={otherRoomId}
            token={token}
            onSwitchRoom={handleSwitchRoom}
            onLeave={handleLeave}
            onMediaRelay={handleMediaRelay}
            isMediaRelaying={isMediaRelaying}
            mediaRelayTarget={mediaRelayTarget}
          />
        </MeetingProvider>
      ) : null}
    </div>
  );
}

export default App;
