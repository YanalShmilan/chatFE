import * as actionTypes from "./types";
import instance from "./instance";

export const addMessage = (roomId, content) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.ADD_MESSAGE,
        payload: { roomId, content },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const createRoom = (room, userId) => {
  return async (dispatch) => {
    console.log(room); // REVIEW: Remove console log if done testing
    try {
      if (room.type !== "Private") {
        room.admin = userId;
      }
      const formData = new FormData();
      for (const key in room) formData.append(key, room[key]);

      const res = await instance.post(`/api/v1/rooms/user/${userId}`, formData);
      dispatch({
        type: actionTypes.CREATE_ROOM,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const fetchRoom = (userId) => {
  return async (dispatch) => {
    try {
      const res = await instance.get(`api/v1/rooms/user/${userId}`);
      let rooms = res.data.map((room) => {
        if (room.type === "Private") {
          let otherUser = room.users.find((user) => user._id !== userId);
          if (otherUser.userName === "") room.name = otherUser.phoneNumber;
          else room.name = otherUser.userName;
          room.photo = otherUser.photo;
        }
        return room;
      });

      dispatch({
        type: actionTypes.FETCH_ROOM,
        payload: rooms,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
