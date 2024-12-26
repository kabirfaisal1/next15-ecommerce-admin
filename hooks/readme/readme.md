# Hooks
<TODO after adding all Providers add summery>

## Hook Component

Defines a custom hook `useStoreModal` using `Zustand`, a state management library for React. The hook manages the state of a modal, specifically whether it is open or closed.

### Here's a summary of the key components:

Interface `useStoreModalStore:` Defines the shape of the store, including:

- `isOpen`: A boolean indicating if the modal is open.
- `onOpen`: A function to open the modal.
- `onClose`: A function to close the modal.
#### Custom Hook useStoreModal:

- Uses `Zustand's` create function to create a store with the initial state where `isOpen` is `false` (modal is closed).

- Provides `onOpen` and `onClose` functions to update the isOpen state.
This hook can be used in React components to control the visibility of a modal.

---
