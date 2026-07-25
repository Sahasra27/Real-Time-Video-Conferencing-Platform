
# Real-Time Video Conferencing Platform

A browser-based multi-party video conferencing platform built using **React**, **Node.js**, **WebRTC**, and **Socket.IO**.

# Application Preview

## Secure Authentication

<table align="center">
<tr>

<td align="center" width="50%">

<img src="https://github.com/user-attachments/assets/c6286b5f-a416-4694-9c6a-65f7dda76827" width="100%" alt="Login Page"/>
**Login**
Secure user login with session token authentication and bcrypt password verification.

</td>

<td align="center" width="50%">

<img  src="https://github.com/user-attachments/assets/ac8dad72-561d-4f67-a6eb-4a911f36f03d" width="100%" alt="Registration Page"/>


**Registration**

New users can create an account with securely hashed passwords before joining meetings.

</td>

</tr>
</table>

---

## Meeting Interface

<p align="center">
  <img src="https://github.com/user-attachments/assets/91a8d4f8-8621-4bcd-9f29-542b897a1e20"
       width="90%"
       alt="Meeting Interface"/>
</p>

<p align="center">
<b>Multi-Party Video Conference</b>
</p>

---

## Features in Action

<table align="center">
<tr>

<td align="center" width="50%">

<img src="https://github.com/user-attachments/assets/dfdda671-3fa1-40c8-917f-828c64ea245e"
width="100%"
alt="Lobby Preview"/>

**Lobby Preview**

Preview camera and microphone before joining the meeting.

</td>

<td align="center" width="50%">

<img src="https://github.com/user-attachments/assets/06955ec8-065b-4953-b5ce-584f31322c5c"
width="100%"
alt="Real-Time Chat"/>

**Real-Time Chat**

Integrated messaging during active video conferences.

</td>

</tr>
</table>
---

# Tech Stack

## Frontend
- React.js
- Vite
- Material UI
- Socket.IO Client

## Backend
- Node.js
- Express.js
- Socket.IO

## Database
- MongoDB
- Mongoose

## Real-Time Communication
- WebRTC
- STUN Server
- DTLS-SRTP
- SDP
- ICE Candidates

## Authentication
- bcrypt Password Hashing
- Session Token Authentication

---

# Key Features

- Secure user authentication (Register/Login)
- Multi-party video conferencing using WebRTC
- Peer-to-peer encrypted audio and video communication
- Screen sharing without renegotiation using `replaceTrack()`
- Real-time text chat
- Camera and microphone controls
- Lobby with live camera preview before joining
- Dynamic participant join/leave handling
- Automatic peer connection management
- Responsive Material UI interface

---

# Engineering Highlights

- Built a custom **Socket.IO signaling server** for WebRTC peer discovery and connection establishment.
- Implemented complete **SDP Offer/Answer negotiation** and **ICE Candidate exchange**.
- Designed a **full-mesh peer-to-peer architecture** where media bypasses the server entirely.
- Used **RTCRtpSender.replaceTrack()** to switch between camera and screen sharing without renegotiating connections.
- Implemented dynamic peer lifecycle management for participant joins, disconnects, and media updates.
- Added chat history replay for newly joined participants.
- Implemented secure password storage using bcrypt hashing.

---

# System Architecture

```text
                    Browser A
               (React + WebRTC)
                      │
                      │
                Socket.IO Client
                      │
                      ▼
          Node.js + Express + Socket.IO
             (Signaling Server Only)
                      │
                      ▼
                Browser B
               (React + WebRTC)

After signaling:

 Browser A  ⇄  Browser B
 (Audio & Video via WebRTC)
```

---

# Call Establishment Flow

```text
User Opens Website
        │
        ▼
Camera & Microphone Permission
        │
        ▼
Preview Screen
        │
        ▼
User Clicks Join
        │
        ▼
Connect to Socket.IO Server
        │
        ▼
Join Meeting Room
        │
        ▼
Create RTCPeerConnection
        │
        ▼
Exchange SDP Offer / Answer
        │
        ▼
Exchange ICE Candidates
        │
        ▼
WebRTC Connection Established
        │
        ▼
Direct Peer-to-Peer Audio & Video
```

---

# Project Structure

```text
backend/
│
├── controllers/
├── models/
├── routes/
├── app.js
│
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── App.jsx
│   └── main.jsx
```

---

# Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGO_URL=your_mongodb_connection_string
PORT=8000
```

---

# Socket.IO Events

## Client → Server

| Event | Purpose |
|--------|----------|
| join-call | Join meeting room |
| signal | Exchange SDP and ICE candidates |
| chat-message | Send chat message |

## Server → Client

| Event | Purpose |
|--------|----------|
| user-joined | Notify users of a new participant |
| signal | Forward SDP or ICE candidates |
| user-left | Remove disconnected participant |
| chat-message | Broadcast chat messages |

---

# Design Decisions

### Why WebRTC?

WebRTC provides:

- Low latency communication
- Adaptive bitrate
- Congestion control
- Echo cancellation
- Built-in encryption (DTLS-SRTP)
- Direct peer-to-peer media transmission

making it the industry standard for browser-based video conferencing.

### Why Socket.IO?

Socket.IO is used only for signaling.

It exchanges:

- SDP Offers
- SDP Answers
- ICE Candidates
- User Join/Leave Events
- Chat Messages

Once peers connect, all media flows directly between browsers without passing through the server.

---

# Challenges Solved

- Prevented duplicate RTCPeerConnections during simultaneous joins.
- Implemented automatic peer cleanup when participants disconnect.
- Switched between camera and screen sharing without renegotiation.
- Maintained chat history for newly joined users.
- Managed dynamic addition and removal of multiple peer connections.

---

# Performance & Scalability

Current Topology:

- Full Mesh

Connections Required:

```
N × (N − 1) / 2
```

Suitable for:

- Small meetings (2–6 users)

Future Improvement:

- Replace mesh topology with an SFU (Selective Forwarding Unit) such as mediasoup or LiveKit for large meetings.

---

# Security

- Passwords are securely hashed using bcrypt.
- Audio and video streams are encrypted using DTLS-SRTP.
- Media never passes through the backend server.
- Signaling and authentication are handled separately.

---

# Known Limitations

- Full Mesh architecture does not scale well for large meetings.
- TURN server is not implemented.
- HTTPS/WSS deployment is required for production.
- Room state is currently stored in memory.

---

# Future Enhancements

- TURN Server Integration
- SFU-based Architecture
- Meeting Recording
- Virtual Backgrounds
- Waiting Rooms
- JWT Authentication
- Redis Adapter for Horizontal Scaling
- Meeting History
- Automated Testing

---

# What I Learned

Building this project helped me gain practical understanding of:

- WebRTC Internals
- SDP Offer/Answer Negotiation
- ICE Candidate Exchange
- NAT Traversal
- STUN Servers
- RTCPeerConnection Lifecycle
- Media Streams and Tracks
- Socket.IO Event-Based Communication
- React State Management
- Real-Time Distributed Systems

---
