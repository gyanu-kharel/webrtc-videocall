import { Box, Container, Stack, Text } from '@chakra-ui/react';
import * as signalR from '@microsoft/signalr';
import React, { useEffect, useRef, useState } from 'react';

const Chat: React.FC = () => {

    const [hubConnection, setHubConnection] = useState<signalR.HubConnection>();
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        var newHubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7133/hub")
            // .configureLogging(signalR.LogLevel.Information)
            .build();

        newHubConnection.start();

        setHubConnection(newHubConnection);

        var localStream = navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .then((localStream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream;
                }

                return localStream;
            });

        const configuration: RTCConfiguration = {
            iceServers: [
                {
                    urls: ["stun:stun.l.google.com:19302"]
                }
            ]
        };
        const pc = new RTCPeerConnection(configuration);

        setPeerConnection(pc)
        localStream
            .then((stream) => {
                stream.getTracks().forEach(track => {
                    if (pc) {
                        pc.addTrack(track, stream)
                    }
                })
            });

        if (pc) {
            pc.addEventListener('track', handleTrackEvent);
        }

        pc.addEventListener("icecandidate", (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
                hubConnection?.invoke("SendIceCandidate", JSON.stringify(event.candidate));
            }
        });

        hubConnection?.invoke("Initiate").then(() => console.log("Call initiated"));

        return () => {
            hubConnection?.stop();
            peerConnection?.close();
        }
    }, []);

    const handleTrackEvent = (event: RTCTrackEvent) => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
        }
    };

    hubConnection?.on("ReceivedIceCandidate", async (candidate: string) => {
        await peerConnection?.addIceCandidate(JSON.parse(candidate));
    });

    hubConnection?.on("Matched", async () => {
        const offer = await peerConnection?.createOffer();
        if (offer) {
            await peerConnection?.setLocalDescription(offer);
            await hubConnection.invoke("SendOffer", JSON.stringify(offer));
        }
    });

    hubConnection?.on("OfferReceived", async (offer: string) => {
        await peerConnection?.setRemoteDescription(JSON.parse(offer));

        const answer = await peerConnection?.createAnswer();
        if (answer) {
            await peerConnection?.setLocalDescription(answer);
            await hubConnection.invoke("SendAnswer", JSON.stringify(answer));
        }
    });

    hubConnection?.on("AnswerReceived", async (answer: string) => {
        await peerConnection?.setRemoteDescription(JSON.parse(answer));
    });
    return (
        <>
            <Container size={'3xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    display={'flex'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}>

                    <video ref={localVideoRef} autoPlay muted></video>
                    <video ref={remoteVideoRef} autoPlay></video>
                </Stack>
            </Container>
        </>
    );
};

export default Chat;