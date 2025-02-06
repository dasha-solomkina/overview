import { create } from 'zustand'
import type { Image, LabelProps } from '../types/type'

type StorePops = {
  imageURL: string | undefined
  image: Image | undefined
  editLabel: LabelProps | undefined
  labels: LabelProps[]
  chosenLabel: LabelProps | undefined

  setImageURL: (imageURL: string) => void
  setImage: (image: Image) => void
  setEditLabel: (label: LabelProps) => void
  setLabels: (labels: LabelProps[]) => void
  setChosenLabel: (labels: LabelProps | undefined) => void

  resetStore: () => void
}

const useStore = create<StorePops>((set) => ({
  imageURL: undefined,
  image: undefined,
  editLabel: undefined,
  labels: [
    { id: 10293847, name: 'Building', color: '#9dad75' },
    { id: 10293832, name: 'Car', color: '#64a8c7' }
  ],
  chosenLabel: undefined,

  setImageURL: (imageURL) => set({ imageURL }),
  setImage: (image) => set({ image }),

  setEditLabel: (label) => set({ editLabel: label }),
  setLabels: (labels) => set(() => ({ labels })),
  setChosenLabel: (chosenLabel) =>
    set((state) => ({
      chosenLabel: state.chosenLabel === chosenLabel ? undefined : chosenLabel
    })),

  resetStore: () => {
    set({
      imageURL: undefined,
      editLabel: undefined,
      chosenLabel: undefined
    })
  }
}))

export default useStore
