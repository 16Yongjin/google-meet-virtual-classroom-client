import create from 'zustand'

export const useStore = create((set) => ({
  clapping: false,
  clap: () => {
    set({ clapping: true })
    setTimeout(() => set({ clapping: false }))
  },
  sketchfabModels: [],
  addSketchfabModel: (url) =>
    set((state) => ({ sketchfabModels: [...state.sketchfabModels, url] })),
  cameraControl: null,
  setCameraControl: (cameraControl) => set({ cameraControl }),
}))
