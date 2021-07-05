// export default function AppStorage() {
//   const setItemInStorage = (key, value) => {
//     window.localStorage.setItem(key, JSON.stringify(value));
//   };
//   const getItemFromStorage = (key, value) => {
//     return JSON.parse(window.localStorage.getItem(key));
//   };
//   const removeItemFromStorage = (key) => {
//     window.localStorage.removeItem(key);
//   };

//   return {
//     setItemInStorage,
//     getItemFromStorage,
//     removeItemFromStorage,
//   };
// }

const AppStorage = {
  setItemInStorage: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  getItemFromStorage: (key, value) => {
    return JSON.parse(window.localStorage.getItem(key));
  },
  removeItemFromStorage: (key) => {
    window.localStorage.removeItem(key);
  },
};
export default AppStorage;
