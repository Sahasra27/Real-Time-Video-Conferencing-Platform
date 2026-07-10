import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import bgImage from "../assets/vc.2.png";

import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'

import styles from "../styles/videoComponent.module.css";

import CallEndIcon from '@mui/icons-material/CallEnd'

import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'

import ChatIcon from '@mui/icons-material/Chat'

const server_url = "http://localhost:8000";

const peerConfigConnections = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

// =========================================
// STABLE VIDEO COMPONENT
// =========================================

const VideoPlayer = ({
    stream,
    muted,
    className,
    style
}) => {

    const videoRef = useRef();

    useEffect(() => {

        if (
            videoRef.current &&
            stream
        ) {

            videoRef.current.srcObject =
                stream;
        }

    }, [stream]);

    return (

        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={className}
            style={style}
        ></video>
    );
};

export default function VideoMeetComponent() {

    // =========================================
    // REFS
    // =========================================

    const socketRef = useRef();

    const socketIdRef = useRef();

    const connections = useRef({});
    const usersRef = useRef({});

    // =========================================
    // STATES
    // =========================================

    const [videoAvailable, setVideoAvailable] =
        useState(true);

    const [audioAvailable, setAudioAvailable] =
        useState(true);

    // BEFORE JOIN THESE STATES DECIDE INITIAL MEDIA

    const [video, setVideo] =
        useState(true);

    const [audio, setAudio] =
        useState(true);

    const [screen, setScreen] =
        useState(false);

    const [screenAvailable, setScreenAvailable] =
        useState(false);

    const [askForUsername, setAskForUsername] =
        useState(true);

    const [username, setUsername] =
        useState("");

    const [videos, setVideos] =
        useState([]);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [newMessages, setNewMessages] =
        useState(0);

    const [showModal, setModal] =
        useState(false);

    const [localStream, setLocalStream] =
        useState(null);

    // =========================================
    // PERMISSIONS
    // =========================================

   useEffect(() => {

    getPermissions();

    // START PREVIEW

    startPreview();

    // CLEANUP

    return () => {

        if (
            window.previewStream
        ) {

            window.previewStream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );
        }
    };

}, []);

    const getPermissions = async () => {

        try {

            const videoPermission =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });

            videoPermission
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

            setVideoAvailable(true);

        } catch (e) {

            setVideoAvailable(false);
        }

        try {

            const audioPermission =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });

            audioPermission
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

            setAudioAvailable(true);

        } catch (e) {

            setAudioAvailable(false);
        }

        if (
            navigator.mediaDevices.getDisplayMedia
        ) {

            setScreenAvailable(true);
        }
    };
const startPreview =
    async () => {

        try {

            // STOP OLD PREVIEW

            if (
                window.previewStream
            ) {

                window.previewStream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );
            }

            // VIDEO OFF IN LOBBY

            if (!video) {

                setLocalStream(null);

                return;
            }

            const previewStream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        video: true,
                        audio: false
                    });

            window.previewStream =
                previewStream;

            setLocalStream(
                previewStream
            );

        } catch (e) {

            console.log(e);
        }
    };
    // =========================================
    // CREATE MEDIA STREAM
    // =========================================

    const createMediaStream =
        async (
            videoEnabled,
            audioEnabled
        ) => {

            // BOTH OFF

            if (
                !videoEnabled &&
                !audioEnabled
            ) {

                const blackSilence =
                    new MediaStream([
                        black(),
                        silence()
                    ]);

                return blackSilence;
            }

            return await navigator
                .mediaDevices
                .getUserMedia({
                    video:
                        videoEnabled,
                    audio:
                        audioEnabled,
                });
        };

    // =========================================
    // UPDATE LOCAL STREAM
    // =========================================

    const updateLocalStream =
        async (
            videoEnabled,
            audioEnabled
        ) => {

            try {
const oldStream =
    window.localStream;
                const stream =
                    await createMediaStream(
                        videoEnabled,
                        audioEnabled
                    );

                // STOP OLD STREAM

               
                window.localStream =
                    stream;

                setLocalStream(
                    stream
                );

                // =========================================
                // REPLACE TRACKS
                // =========================================

                for (
                    let id in
                    connections.current
                ) {

                    const peerConnection =
                        connections.current[
                            id
                        ];

                    const senders =
                        peerConnection.getSenders();

                    stream
                        .getTracks()
                        .forEach(
                            track => {

                                const sender =
                                    senders.find(
                                        s =>
                                            s.track &&
                                            s.track.kind ===
                                            track.kind
                                    );

                                if (
                                    sender
                                ) {

                                    sender.replaceTrack(
                                        track
                                    );

                                } else {

                                    peerConnection.addTrack(
                                        track,
                                        stream
                                    );
                                }
                            }
                        );
                }
// STOP OLD STREAM AFTER REPLACEMENT

setTimeout(() => {

    if (
        oldStream &&
        oldStream !== stream
    ) {

        oldStream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );
    }

}, 1000);
            } catch (e) {

                console.log(e);
            }
        };

    // =========================================
    // TOGGLE MEDIA AFTER JOIN
    // =========================================
// =========================================
// TOGGLE MEDIA AFTER JOIN
// =========================================

useEffect(() => {

    if (
        !askForUsername
    ) {

        updateLocalStream(
            video,
            audio
        );
    }

}, [video, audio]);

// =========================================
// UPDATE PREVIEW BEFORE JOIN
// =========================================

useEffect(() => {

    if (
        askForUsername
    ) {

        startPreview();
    }

}, [video]);

    // =========================================
    // SIGNALS
    // =========================================

    const gotMessageFromServer =
        async (
            fromId,
            message
        ) => {
            console.log(
    "MESSAGE RECEIVED FROM:",
    fromId
);

console.log(
    "RAW MESSAGE:",
    message
);

            const signal =
                JSON.parse(message);
console.log(
    "PARSED SIGNAL:",
    signal
);
            if (
                fromId ===
                socketIdRef.current
            ) {
                return;
            }

            // =========================================
            // CREATE PEER IF MISSING
            // =========================================

            if (
                !connections.current[
                    fromId
                ]
            ) {

                const peerConnection =
                    new RTCPeerConnection(
                        peerConfigConnections
                    );

                connections.current[
                    fromId
                ] = peerConnection;
// ⏱️ latency probe — safe, non-invasive
const __t0_offer = performance.now();
peerConnection.addEventListener("connectionstatechange", () => {
    if (peerConnection.connectionState === "connected") {
        console.log(`⏱️ SETUP LATENCY [${fromId}]: ${(performance.now() - __t0_offer).toFixed(0)} ms`);
    }
});
                // ICE

                peerConnection.onicecandidate =
                    event => {

                        if (
                            event.candidate
                        ) {

                            socketRef.current.emit(
                                "signal",
                                fromId,
                                JSON.stringify({
                                    ice:
                                        event.candidate
                                })
                            );
                        }
                    };

                // TRACK

                peerConnection.ontrack =
                    event => {

                        const stream =
                            event.streams[0];

                        if (
                            !stream
                        ) return;

                        setVideos(
                            videos => {

                                const exists =
                                    videos.find(
                                        video =>
                                            video.socketId ===
                                            fromId
                                    );

                                if (
                                    exists
                                ) {

                                    return videos.map(
                                        video =>

                                            video.socketId ===
                                            fromId

                                                ? {
                                                    ...video,
                                                    stream
                                                }

                                                : video
                                    );
                                }

                               return [

    ...videos,

    {
        socketId:
            fromId,

        stream,

        username: usersRef.current?.[fromId]
    }
];
                            }
                        );
                    };

                // ADD LOCAL TRACKS

                if (
                    window.localStream
                ) {

                    window.localStream
                        .getTracks()
                        .forEach(
                            track => {

                                peerConnection
                                    .addTrack(
                                        track,
                                        window.localStream
                                    );
                            }
                        );
                }
            }

            const peerConnection =
                connections.current[
                    fromId
                ];

            // SDP

            if (
                signal.sdp
            ) {
console.log(
    "SDP RECEIVED FROM:",
    fromId
);

console.log(
    "SDP TYPE:",
    signal.sdp.type
);
                await peerConnection
                    .setRemoteDescription(
                        new RTCSessionDescription(
                            signal.sdp
                        )
                    );

                if (
                    signal.sdp.type ===
                    "offer"
                ) {
console.log(
    "CREATING ANSWER FOR:",
    fromId
);
                    const description =
                        await peerConnection
                            .createAnswer();

                    await peerConnection
                        .setLocalDescription(
                            description
                        );

                    socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                            sdp:
                                peerConnection.localDescription
                        })
                    );
                }
            }

            // ICE

            if (
                signal.ice
            ) {
console.log(
    "ICE RECEIVED FROM:",
    fromId
);

console.log(
    signal.ice
);
                try {

                    await peerConnection
                        .addIceCandidate(
                            new RTCIceCandidate(
                                signal.ice
                            )
                        );

                } catch (e) {

                    console.log(e);
                }
            }
        };

    // =========================================
    // SOCKET
    // =========================================

    const connectToSocketServer =
        () => {

            socketRef.current =
                io.connect(
                    server_url,
                    {
                        secure: false
                    }
                );

            socketRef.current.on(
                "signal",
                gotMessageFromServer
            );

            socketRef.current.on(
                "connect",
                () => {

                    socketIdRef.current =
                        socketRef.current.id;
console.log(
    "SOCKET CONNECTED:",
    socketRef.current.id
);

console.log(
    "LOCAL STREAM:",
    window.localStream
);
                    socketRef.current.emit(
    "join-call",
    {
        path:
            window.location.href,

        username:
            username
    }
);
                    // CHAT

                    socketRef.current.on(
                        "chat-message",
                        addMessage
                    );

                    // USER LEFT

                    socketRef.current.on(
                        "user-left",
                        id => {

                            setVideos(
                                videos =>

                                    videos.filter(
                                        video =>
                                            video.socketId !==
                                            id
                                    )
                            );

                            if (
                                connections.current[
                                    id
                                ]
                            ) {

                                connections.current[
                                    id
                                ].close();

                                delete connections.current[
                                    id
                                ];
                            }
                        }
                    );

                    // USER JOINED

                    socketRef.current.on(
                        "user-joined",
                      (
    id,
    clients,
    users
) => {
console.log(
    "USER JOINED EVENT FIRED"
);

console.log(
    "JOINED USER ID:",
    id
);

console.log(
    "CLIENTS:",
    clients
);
usersRef.current =
    users;
                            clients.forEach(
                                socketListId => {
console.log(
    "PROCESSING CLIENT:",
    socketListId
);
                                    if (
                                        socketListId ===
                                        socketIdRef.current
                                    ) {
                                        return;
                                    }

                                    let peerConnection =
                                        connections.current[
                                            socketListId
                                        ];

                                    // CREATE PEER

                                    if (
                                        !peerConnection
                                    ) {

                                        peerConnection =
                                            new RTCPeerConnection(
                                                peerConfigConnections
                                            );
console.log(
    "PEER CONNECTION CREATED FOR:",
    socketListId
);
                                        connections.current[
                                            socketListId
                                        ] =
                                            peerConnection;

                                        // ⏱️ latency probe — peer just created here, always defined
                                        const __t0_join = performance.now();
                                        peerConnection.addEventListener("connectionstatechange", () => {
                                            if (peerConnection.connectionState === "connected") {
                                                console.log(`⏱️ SETUP LATENCY [${socketListId}]: ${(performance.now() - __t0_join).toFixed(0)} ms`);
                                            }
                                        });

                                        // ICE

                                        peerConnection.onicecandidate =
                                            event => {
console.log(
    "ICE CANDIDATE GENERATED FOR:",
    socketListId,
    event.candidate
);
                                                if (
                                                    event.candidate
                                                ) {

                                                    socketRef.current.emit(
                                                        "signal",
                                                        socketListId,
                                                        JSON.stringify({
                                                            ice:
                                                                event.candidate
                                                        })
                                                    );
                                                }
                                            };

                                        // TRACK

                                        peerConnection.ontrack =
                                            event => {
console.log(
    "ONTRACK FIRED FOR:",
    socketListId
);

console.log(
    "TRACKS:",
    event.streams
);

console.log(
    "TRACK OBJECT:",
    event.track
);
                                                const stream =
                                                    event.streams[0];

                                                if (
                                                    !stream
                                                ) return;

                                                setVideos(
                                                    videos => {

                                                        const exists =
                                                            videos.find(
                                                                video =>
                                                                    video.socketId ===
                                                                    socketListId
                                                            );

                                                        if (
                                                            exists
                                                        ) {

                                                            return videos.map(
                                                                video =>

                                                                    video.socketId ===
                                                                    socketListId

                                                                        ? {
                                                                            ...video,
                                                                            stream
                                                                        }

                                                                        : video
                                                            );
                                                        }

                                                     return [

    ...videos,

    {
        socketId:
            socketListId,

        stream,

        username: usersRef.current?.[socketListId]
    }
];
                                                    }
                                                );
                                            };
                                    }

                                    // ADD TRACKS

                                    if (
                                        window.localStream
                                    ) {

                                        window.localStream
                                            .getTracks()
                                            .forEach(
                                                track => {

                                                    const senderExists =
                                                        peerConnection
                                                            .getSenders()
                                                            .find(
                                                                sender =>
                                                                    sender.track &&
                                                                    sender.track.kind ===
                                                                    track.kind
                                                            );

                                                    if (
                                                        !senderExists
                                                    ) {

                                                        peerConnection
                                                            .addTrack(
                                                                track,
                                                                window.localStream
                                                            );
                                                    }
                                                }
                                            );
                                    }

                                    // CREATE OFFER

                                    if (
                                        id ===
                                        socketIdRef.current
                                    ) {
console.log(
    "CREATING OFFER FOR:",
    socketListId
);
                                        peerConnection
                                            .createOffer()

                                            .then(
                                                description =>

                                                    peerConnection
                                                        .setLocalDescription(
                                                            description
                                                        )
                                            )

                                            .then(() => {
console.log(
    "LOCAL DESCRIPTION SET FOR:",
    socketListId
);

console.log(
    "SENDING SDP OFFER:",
    peerConnection.localDescription
);
                                                socketRef.current.emit(
                                                    "signal",
                                                    socketListId,
                                                    JSON.stringify({
                                                        sdp:
                                                            peerConnection.localDescription
                                                    })
                                                );
                                            })

                                            .catch(
                                                e =>
                                                    console.log(
                                                        e
                                                    )
                                            );
                                    }
                                }
                            );
                        }
                    );
                }
            );
        };

    // =========================================
    // BLACK + SILENCE
    // =========================================

    const silence = () => {

        const ctx =
            new AudioContext();

        const oscillator =
            ctx.createOscillator();

        const dst =
            oscillator.connect(
                ctx.createMediaStreamDestination()
            );

        oscillator.start();

        const track =
            dst.stream.getAudioTracks()[0];

        track.enabled = false;

        return track;
    };

    const black = ({
        width = 640,
        height = 480
    } = {}) => {

        const canvas =
            Object.assign(
                document.createElement(
                    "canvas"
                ),
                {
                    width,
                    height
                }
            );

        canvas
            .getContext("2d")
            .fillRect(
                0,
                0,
                width,
                height
            );

        const stream =
            canvas.captureStream();

        const track =
            stream.getVideoTracks()[0];

        track.enabled = false;

        return track;
    };

    // =========================================
    // SCREEN SHARE
    // =========================================

    useEffect(() => {

        if (
            screen
        ) {

            startScreenShare();
        }

    }, [screen]);

    const startScreenShare =
        async () => {

            try {

                const stream =
                    await navigator.mediaDevices.getDisplayMedia({
                        video: true
                    });

                const screenTrack =
                    stream.getVideoTracks()[0];

                for (
                    let id in
                    connections.current
                ) {

                    const sender =
                        connections.current[
                            id
                        ]
                            .getSenders()
                            .find(
                                s =>
                                    s.track &&
                                    s.track.kind ===
                                    "video"
                            );

                    if (
                        sender
                    ) {

                        sender.replaceTrack(
                            screenTrack
                        );
                    }
                }

                setLocalStream(
                    stream
                );

                window.localStream =
                    stream;

                screenTrack.onended =
                    () => {

                        setScreen(false);

                        updateLocalStream(
                            video,
                            audio
                        );
                    };

            } catch (e) {

                console.log(e);
            }
        };

    // =========================================
    // CHAT
    // =========================================

    const addMessage = (
        data,
        sender,
        socketIdSender
    ) => {

        setMessages(
            prev => [

                ...prev,

                {
                    sender,
                    data
                }
            ]
        );

        if (
            socketIdSender !==
            socketIdRef.current
        ) {

            setNewMessages(
                prev => prev + 1
            );
        }
    };

    const sendMessage =
        () => {

            socketRef.current.emit(
                "chat-message",
                message,
                username
            );

            setMessage("");
        };

    // =========================================
    // HANDLERS
    // =========================================

    // =========================================
// HANDLERS
// =========================================

const handleVideo =
    () => {

        const newVideoState =
            !video;

        setVideo(
            newVideoState
        );

        // =========================================
        // UPDATE ACTUAL VIDEO TRACK
        // =========================================

        if (
            window.localStream
        ) {

            const videoTracks =
                window.localStream.getVideoTracks();

            videoTracks.forEach(
                track => {

                    track.enabled =
                        newVideoState;
                }
            );
        }

        // =========================================
        // BEFORE JOIN PREVIEW
        // =========================================

        if (
            askForUsername
        ) {

            if (
                newVideoState
            ) {

                startPreview();

            } else {

                if (
                    window.previewStream
                ) {

                    window.previewStream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );
                }

                setLocalStream(
                    null
                );
            }
        }
    };

const handleAudio =
    () => {

        const newAudioState =
            !audio;

        setAudio(
            newAudioState
        );

        // =========================================
        // UPDATE ACTUAL AUDIO TRACK
        // =========================================

        if (
            window.localStream
        ) {

            const audioTracks =
                window.localStream.getAudioTracks();

            audioTracks.forEach(
                track => {

                    track.enabled =
                        newAudioState;
                }
            );
        }
    };
    const handleScreen =
        () => {

            setScreen(
                prev => !prev
            );
        };

    const handleEndCall =
        () => {

            if (
                window.localStream
            ) {

                window.localStream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );
            }

            window.location.href =
                "/";
        };

    // =========================================
    // CONNECT
    // =========================================
const connect =
    async () => {

        // =========================================
        // USERNAME VALIDATION
        // =========================================

        if (
            username.trim() === ""
        ) {

            alert(
                "Please enter your username"
            );

            return;
        }

        try {

            // STOP PREVIEW STREAM

            if (
                window.previewStream
            ) {

                window.previewStream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );
            }

            // CREATE ACTUAL MEETING STREAM

            const stream =
                await createMediaStream(
                    video,
                    audio
                );

            window.localStream =
                stream;
console.log(
    "LOCAL STREAM CREATED:",
    stream
);
            setLocalStream(
                stream
            );

            // ENTER MEETING

            setAskForUsername(
                false
            );

            connectToSocketServer();

        } catch (e) {

            console.log(e);
        }
    };

    // =========================================
    // UI
    // =========================================

    return (

        <div>

            {
                askForUsername ?
<div
className='previewbg'
    style={{
        minHeight: "100vh",
        width: "100%",
            backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        boxSizing: "border-box"
    }}
>

    <div
        style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            gap: "40px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap"
        }}
    >

        {/* LEFT SIDE */}

        <div
            style={{
                flex: 1,
                minWidth: "320px",
                color: "white"
            }}
        >

            <h1
                style={{
                    fontSize: "48px",
                    marginBottom: "15px",
                    fontWeight: "600"
                }}
            >
                Ready to Join?
            </h1>

            <p
                style={{
                    color: "#b0b3b8",
                    fontSize: "18px",
                    marginBottom: "35px"
                }}
            >
                Check your camera and microphone before entering the meeting.
            </p>

            <TextField
                label="Enter Your Name"
                variant="outlined"
                value={username}
                onChange={(e) =>
                    setUsername(
                        e.target.value
                    )
                }
                sx={{
                    width: "100%",
                    maxWidth: "400px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    marginBottom: "25px"
                }}
            />

            {/* CONTROLS */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >

                {/* VIDEO */}

                <IconButton
                    onClick={handleVideo}
                    style={{
                        backgroundColor:
                            video
                                ? "#3c4043"
                                : "#ea4335",

                        color: "white",
                        width: "60px",
                        height: "60px"
                    }}
                >

                    {
                        video ?

                            <VideocamIcon />

                            :

                            <VideocamOffIcon />
                    }

                </IconButton>

                {/* AUDIO */}

                <IconButton
                    onClick={handleAudio}
                    style={{
                        backgroundColor:
                            audio
                                ? "#3c4043"
                                : "#ea4335",

                        color: "white",
                        width: "60px",
                        height: "60px"
                    }}
                >

                    {
                        audio ?

                            <MicIcon />

                            :

                            <MicOffIcon />
                    }

                </IconButton>

            </div>

            {/* JOIN BUTTON */}

            <Button
                variant="contained"
                onClick={connect}
                 className="ctaButton"
                
            >
                Join Meeting
            </Button>

        </div>

        {/* RIGHT SIDE VIDEO PREVIEW */}

        <div
            style={{
                flex: 1,
                minWidth: "320px",
                display: "flex",
                justifyContent: "center"
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: "550px",
                    height: "380px",
                    backgroundColor: "black",
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow:
                        "0px 4px 20px rgba(0,0,0,0.4)"
                }}
            >

                {
                    localStream ? (

                        <VideoPlayer
                            stream={localStream}
                            muted={true}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                    ) : (

                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "black",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "26px",
                                fontWeight: "500"
                            }}
                        >
                            Camera Off
                        </div>
                    )
                }

                {/* YOU LABEL */}

                <div
                    style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "15px",
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}
                >
                    You
                </div>

            </div>

        </div>

    </div>

</div>
                    
:
(
    <div
        className={
            styles.meetVideoContainer
        }
    >

        {/* MAIN REMOTE VIDEO */}

        {/* MAIN VIDEO AREA */}

{/* MAIN VIDEO AREA */}

{/* MAIN VIDEO AREA */}

<div
    style={{
        position: "fixed",
        top: "0",
        left: "0",

        width: "100%",
        height: "100vh",

        backgroundColor: "#181A1B",

        overflow: "hidden",

        zIndex: 1
    }}
>

    {
        localStream ? (

            <VideoPlayer
                stream={localStream}
                muted={true}
                style={{
                    width: "100%",
                    height: "100%",

                    objectFit: "cover"
                }}
            />

        ) : (

            <div
                style={{
                    width: "100%",
                    height: "100%",

                    backgroundColor:
                        "#202124",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    color: "white",

                    fontSize: "42px",

                    fontWeight: "600"
                }}
            >

                {username}

            </div>
        )
    }

    {/* YOUR NAME */}

    <div
        style={{
            position: "absolute",

            bottom: "25px",
            left: "25px",

            backgroundColor:
                "rgba(0,0,0,0.45)",

            padding: "10px 18px",

            borderRadius: "30px",

            color: "white",

            fontSize: "16px",

            fontWeight: "500",

            backdropFilter:
                "blur(6px)"
        }}
    >

        {username} (You)

    </div>

</div>

        {/* CHAT */}

        {
            showModal &&

            <div
                className={
                    styles.chatRoom
                }
                style={{
                    zIndex: 40
                }}
            >

                <div
                    className={
                        styles.chatContainer
                    }
                >

                    <h1>
                        Chat
                    </h1>

                    <div
                        className={
                            styles.chattingDisplay
                        }
                    >

                        {
                            messages.length !== 0

                                ?

                                messages.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            style={{
                                                marginBottom:
                                                    "20px"
                                            }}
                                        >

                                            <p
                                                style={{
                                                    fontWeight:
                                                        "bold"
                                                }}
                                            >
                                                {
                                                    item.sender
                                                }
                                            </p>

                                            <p>
                                                {
                                                    item.data
                                                }
                                            </p>

                                        </div>
                                    )
                                )

                                :

                                <p>
                                    No Messages Yet
                                </p>
                        }

                    </div>

                    <div
                        className={
                            styles.chattingArea
                        }
                    >

                        <TextField
                            value={message}
                            onChange={e =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            label="Enter Your Chat"
                        />

                        <Button
                            variant="contained"
                            onClick={sendMessage}
                        >
                            Send
                        </Button>

                    </div>

                </div>

            </div>
        }

        {/* BUTTONS */}

        <div
            className={
                styles.buttonContainers
            }
            style={{
                zIndex: 30,
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform:
                    "translateX(-50%)"
            }}
        >

            <IconButton
                onClick={handleVideo}
                style={{
                    color:
                        "white"
                }}
            >

                {
                    video

                        ? <VideocamIcon />

                        : <VideocamOffIcon />
                }

            </IconButton>

            <IconButton
                onClick={handleEndCall}
                style={{
                    color:
                        "red"
                }}
            >

                <CallEndIcon />

            </IconButton>

            <IconButton
                onClick={handleAudio}
                style={{
                    color:
                        "white"
                }}
            >

                {
                    audio

                        ? <MicIcon />

                        : <MicOffIcon />
                }

            </IconButton>

            {
                screenAvailable &&

                <IconButton
                    onClick={handleScreen}
                    style={{
                        color:
                            "white"
                    }}
                >

                    {
                        screen

                            ? <StopScreenShareIcon />

                            : <ScreenShareIcon />
                    }

                </IconButton>
            }

            <Badge
                badgeContent={
                    newMessages
                }
                max={999}
                color="primary"
            >

                <IconButton
                    onClick={() =>
                        setModal(
                            !showModal
                        )
                    }
                    style={{
                        color:
                            "white"
                    }}
                >

                    <ChatIcon />

                </IconButton>

            </Badge>

        </div>

        {/* LOCAL VIDEO */}

       {/* LOCAL VIDEO */}


        {/* OTHER REMOTE USERS */}

        {/* OTHER REMOTE USERS */}
{/* OTHER REMOTE USERS */}

<div
    style={{
        position: "fixed",

        top: "25px",
        left: "25px",

        width: "320px",

        maxHeight: "70vh",

        overflowY: "auto",

        display: "grid",

        gridTemplateColumns:
            "repeat(auto-fill, minmax(150px, 1fr))",

        gap: "15px",

        zIndex: 20
    }}
>

    {
        videos
            .map(
                (
                    video
                ) => (

                    <div
                        key={
                            video.socketId
                        }

                        style={{

                            width: "150px",

                            height: "110px",

                            borderRadius: "16px",

                            overflow: "hidden",

                            position: "relative",

                            backgroundColor:
                                "#202124",

                            border:
                                "2px solid rgba(255,255,255,0.12)",

                            boxShadow:
                                "0px 4px 15px rgba(0,0,0,0.35)"
                        }}
                    >

                        {
                            video.stream ? (

                                <VideoPlayer
                                    stream={
                                        video.stream
                                    }

                                    muted={false}

                                    style={{
                                        width: "100%",
                                        height: "100%",

                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",

                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent: "center",

                                        backgroundColor:
                                            "#202124",

                                        color: "white",

                                        fontSize: "16px",

                                        fontWeight: "600",

                                        textAlign: "center",

                                        padding: "10px"
                                    }}
                                >

                                    {
                                        video?.username ||
                                        "User"
                                    }

                                </div>
                            )
                        }

                        {/* USERNAME */}

                        <div
                            style={{
                                position: "absolute",

                                bottom: "8px",
                                left: "8px",

                                backgroundColor:
                                    "rgba(0,0,0,0.45)",

                                padding:
                                    "4px 10px",

                                borderRadius:
                                    "20px",

                                color: "white",

                                fontSize: "11px",

                                fontWeight: "500",

                                maxWidth: "85%",

                                overflow: "hidden",

                                whiteSpace: "nowrap",

                                textOverflow:
                                    "ellipsis"
                            }}
                        >

                            {
                                video?.username ||
                                "User"
                            }

                        </div>

                    </div>
                )
            )
    }

</div>
    </div>
)
}

</div>
);
}
