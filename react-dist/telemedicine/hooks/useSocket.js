// import { io, Socket } from 'socket.io-client';

export const useSocket = (roomId, userRole) => {
  // const socketRef = useRef<Socket | null>(null);

  // useEffect(() => {
  //   const socket = io("https://dev.monaros.co", {
  //     path: "/telemedicina/socket.io",
  //     transports: ["websocket"],
  //     query: { roomId, userRole }
  //   });

  //   socketRef.current = socket;

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [roomId, userRole]);

  // return socketRef.current;
};