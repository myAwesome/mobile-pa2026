import { create } from 'zustand';
import { Post } from '../api/client';

interface PostsState {
  selectedPost: Post | null;
  setSelectedPost: (post: Post) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));
