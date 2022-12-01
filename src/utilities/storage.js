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

// export default class AppStorage {
//   constructor(key) {
//     this.key = key;
//   }
//   setItemInStorage(value) {
//     window.localStorage.setItem(this.key, JSON.stringify(value));
//   }
//   getItemFromStorage() {
//     return JSON.parse(window.localStorage.getItem(this.key));
//   }
//   removeItemFromStorage() {
//     window.localStorage.removeItem(this.key);
//   }
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
  }
};
export default AppStorage;
