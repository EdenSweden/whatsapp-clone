//start at 1:35:04
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client'; 

const SocketContext = React.createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {

    const [socket, setSocket] = useState();

    useEffect(() => {
        const newSocket = io('http://localhost:5000', 
        { query: { id } });

        setSocket(newSocket);
        //IMPORTANT: close the old socket and create a new one each time the effect runs:
        return () => newSocket.close();
    }, [id]);

  return (
    <div>
        <SocketContext.Provider value={socket}>
            { children }
        </SocketContext.Provider>
    </div>
  )
}
