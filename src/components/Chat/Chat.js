import React, { useEffect, useState } from 'react';
import ContactList from './ContactList';
import InputField from './InputField';
import LeftHeader from './LeftHeader';
import MsgsList from './MsgsList';
import RightHeader from './RightHeader';
import SearchBar from './SearchBar';
import { io } from 'socket.io-client';
import Room from './Room';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../store/actions/chatActions';
export default function Chat() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSocket(io('localhost:8000'));
  }, []);
  if (socket && loading === false) {
    setLoading(true);
  }
  useEffect(() => {
    if (socket) {
      socket.emit('userId', user._id);
      socket.on('message', (message) => {
        // to Do , add sound
        dispatch(addMessage(message.roomId, message.content));
      });
    }
  }, [loading]);
  const [roomId, setRoomId] = useState(false);
  return (
    <>
      <div>
        <div class="w-full h-32" style={{ backgroundColor: '#449388' }}></div>

        <div class="container mx-auto" style={{ marginTop: '-128px' }}>
          <div class="py-6 h-screen">
            <div class="flex border border-grey rounded shadow-lg h-full">
              {/* <!-- Left --> */}
              <div class="w-1/3 border flex flex-col">
                <LeftHeader />
                <SearchBar />
                <ContactList setRoomId={setRoomId} />
              </div>
              {/* <!-- Right --> */}
              {<Room roomId={roomId} socket={socket} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
