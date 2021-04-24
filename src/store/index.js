import create from 'zustand'

export const useStore = create((set) => ({
  clapping: false,
  clap: () => {
    set({ clapping: true })
    setTimeout(() => set({ clapping: false }))
  },
  sketchfabModels: ['43b8a378e7a74898855fe0075215aa48'],
  addSketchFabModel: (url) =>
    set((state) => ({ sketchfabModels: [...state.sketchfabModels, url] })),
  cameraControl: null,
  setCameraControl: (cameraControl) => set({ cameraControl }),
}))
