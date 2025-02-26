# Hooks
<TODO after adding all Providers add summery>

# useStoreModal
Defines a custom hook `useStoreModal` using `Zustand`, a state management library for React. The hook manages the state of a modal, specifically whether it is open or closed.

## Here's a summary of the key components:

Interface `useStoreModalStore:` Defines the shape of the store, including:

- `isOpen`: A boolean indicating if the modal is open.
- `onOpen`: A function to open the modal.
- `onClose`: A function to close the modal.

## Custom Hook useStoreModal:

- Uses `Zustand's` create function to create a store with the initial state where `isOpen` is `false` (modal is closed).

- Provides `onOpen` and `onClose` functions to update the isOpen state.
This hook can be used in React components to control the visibility of a modal.

---

# useOrigin
The `useOrigin` hook is a custom React hook that retrieves the origin of the current window location. It ensures that the origin is only accessed and returned after the component has been mounted, preventing issues with server-side rendering.


## Details
- State Management: Uses a state variable mounted to track if the component has been `mounted`.
- Effect Hook: Uses `useEffect` to set the `mounted` state to true after the component mounts.
- Conditional Rendering: Returns `null` if the component is not yet `mounted` to avoid accessing window during server-side rendering.
- Origin Retrieval: Returns the `window.location.origin` if available, otherwise returns an `empty` string.

This hook is particularly useful in scenarios where you need to safely access the window's origin in a React component, especially in environments that involve server-side rendering.
