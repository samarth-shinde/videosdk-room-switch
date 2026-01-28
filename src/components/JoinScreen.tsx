import React, { useState } from "react";
import { createMeeting, validateMeeting } from "../api";

interface JoinScreenProps {
  token: string;
  onJoinRoom: (meetingId: string, roomLabel: string, otherRoomId: string | null) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ token, onJoinRoom }) => {
  const [roomAId, setRoomAId] = useState<string>("");
  const [roomBId, setRoomBId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [createdRooms, setCreatedRooms] = useState<{
    roomA: string | null;
    roomB: string | null;
  }>({ roomA: null, roomB: null });

  const handleCreateBothRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const [roomA, roomB] = await Promise.all([
        createMeeting(token),
        createMeeting(token),
      ]);
      setCreatedRooms({ roomA, roomB });
      setRoomAId(roomA);
      setRoomBId(roomB);
    } catch (err) {
      setError("Failed to create rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoomA = async () => {
    setLoading(true);
    setError("");
    try {
      const meetingId = roomAId || createdRooms.roomA;
      if (!meetingId) {
        setError("Please create or enter Room A ID");
        setLoading(false);
        return;
      }

      const isValid = await validateMeeting(token, meetingId);
      if (!isValid) {
        setError("Invalid Room A ID");
        setLoading(false);
        return;
      }

      const otherRoom = roomBId || createdRooms.roomB;
      onJoinRoom(meetingId, "Room A", otherRoom);
    } catch (err) {
      setError("Failed to join Room A");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoomB = async () => {
    setLoading(true);
    setError("");
    try {
      const meetingId = roomBId || createdRooms.roomB;
      if (!meetingId) {
        setError("Please create or enter Room B ID");
        setLoading(false);
        return;
      }

      const isValid = await validateMeeting(token, meetingId);
      if (!isValid) {
        setError("Invalid Room B ID");
        setLoading(false);
        return;
      }

      const otherRoom = roomAId || createdRooms.roomA;
      onJoinRoom(meetingId, "Room B", otherRoom);
    } catch (err) {
      setError("Failed to join Room B");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-screen">
      <div className="join-container">
        <h1>Room Switch Demo</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="create-rooms-section">
          <button
            className="create-btn"
            onClick={handleCreateBothRooms}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Rooms"}
          </button>
        </div>

        <div className="rooms-grid">
          <div className="room-card room-a">
            <h2>Room A</h2>
            <input
              type="text"
              placeholder="Room A ID"
              value={roomAId || createdRooms.roomA || ""}
              onChange={(e) => setRoomAId(e.target.value)}
              disabled={loading}
            />
            <button
              className="join-btn"
              onClick={handleJoinRoomA}
              disabled={loading || (!roomAId && !createdRooms.roomA)}
            >
              Join Room A
            </button>
          </div>

          <div className="room-card room-b">
            <h2>Room B</h2>
            <input
              type="text"
              placeholder="Room B ID"
              value={roomBId || createdRooms.roomB || ""}
              onChange={(e) => setRoomBId(e.target.value)}
              disabled={loading}
            />
            <button
              className="join-btn"
              onClick={handleJoinRoomB}
              disabled={loading || (!roomBId && !createdRooms.roomB)}
            >
              Join Room B
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinScreen;
