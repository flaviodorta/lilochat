import { Room, RoomPlaylist, Video, User } from '@/types';
import type ReactPlayer from 'react-player';
import { createStore } from 'zustand/vanilla';

interface UserMessage {
  user_id: number;
  user_nickname: string;
  content: string;
  created_at: string;
}

export type RoomMessage = UserMessage;

type RoomState = {
  user: User;
  usersInRoom: User[];
  room: Room;
  videos: Video[];
  items: RoomPlaylist[];
  messages: RoomMessage[] | null;
  playing: boolean;
};

type RoomActions = {
  setUser: (user: User) => void;
  setUsersInRoom: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (user_id: number) => void;

  setRoom: (room: Room) => void;

  setItems: (items: RoomPlaylist[]) => void;
  addItem: (item: RoomPlaylist) => void;

  setMessages: (messages: RoomMessage[]) => void;
  addMessage: (message: RoomMessage) => void;

  setPlaying: (playing: boolean) => void;

  setVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
};

export type RoomStore = RoomState & RoomActions;

export const initRoomStore = (): RoomState => ({
  user: {} as User,
  usersInRoom: [],
  room: {} as Room,
  videos: [],
  items: [],
  messages: null,
  playing: false,
});

const defaultInitStore: RoomState = initRoomStore();

export const createRoomStore = (initState: RoomState = defaultInitStore) =>
  createStore<RoomStore>()((set) => ({
    ...initState,

    // Users
    setUser: (user) => set({ user }),
    setUsersInRoom: (users) => set({ usersInRoom: users }),
    addUser: (user) =>
      set((state) => ({ usersInRoom: [...state.usersInRoom, user] })),
    removeUser: (user_id) =>
      set((state) => ({
        usersInRoom: state.usersInRoom.filter((u) => u.id !== user_id),
      })),

    // Room
    setRoom: (room) => set({ room }),

    // Playlist items
    setItems: (items) => set({ items }),
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),

    // Messages
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages!, message] })),

    // Player
    setPlaying: (playing) => set({ playing }),

    // Videos
    setVideos: (videos) => set({ videos }),
    addVideo: (video) => set((state) => ({ videos: [...state.videos, video] })),
  }));
