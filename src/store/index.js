import create from 'zustand'

export const useStore = create((set) => ({
  clapping: false,
  clap: () => {
    set({ clapping: true })
    setTimeout(() => set({ clapping: false }))
  },
  sketchfabModels: [],
  addSketchfabModel: (model) =>
    set((state) => ({ sketchfabModels: [...state.sketchfabModels, model] })),
  removeSketchfabModel: (uuid) =>
    set(({ sketchfabModels }) => ({
      sketchfabModels: sketchfabModels.filter((m) => m.uuid !== uuid),
    })),
  cameraControl: null,
  setCameraControl: (cameraControl) => set({ cameraControl }),
  staticModels: [
    {
      position: [0.7082807878600228, 0.4582873054201091, 0],
      quaternion: [0, -0.7299996034527569, 0, 0.6834475685513979],
      scale: [1, 1, 1],
      uid: '41973aa1808d4a13b84c24497fc77c63',
      uuid: 'static_chair_0',
    },
    {
      position: [-1.1011157035827637, 0.4582873054201091, 0.24833738803863525],
      quaternion: [0, -0.7299996034527569, 0, 0.6834475685513979],
      scale: [1, 1, 1],
      uid: '41973aa1808d4a13b84c24497fc77c63',
      uuid: 'static_chair_1',
    },
  ],
  removeStaticModel: (uuid) =>
    set(({ staticModels }) => ({
      staticModels: staticModels.filter((m) => m.uuid !== uuid),
    })),

  expandedModel: null,
  expandModel: (url) => set({ expandedModel: url }),
  removeExpanedModel: () => set({ expandedModel: null }),
}))
