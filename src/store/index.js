import create from 'zustand'

export const useStore = create((set) => ({
  clapping: false,
  clap: () => {
    set({ clapping: true })
    setTimeout(() => set({ clapping: false }))
  },
}))
