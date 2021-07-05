import React, { createContext, useEffect } from "react";
import { AppConstant, AppStorage } from "./utilities";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // const [navigationHader, setNavigationHader] = useState("color_1");
  const body = document.querySelector("body");
  // const [windowWidth, setWindowWidth] = useState(0);
  // const [windowHeight, setWindowHeight] = useState(0);

  let resizeWindow = () => {
    // setWindowWidth(window.innerWidth);
    // setWindowHeight(window.innerHeight);
    // window.innerWidth >= 768 && window.innerWidth < 1351
    //   ? body.setAttribute("data-sidebar-style", "mini")
    //   : window.innerWidth <= 768
    //   ? body.setAttribute("data-sidebar-style", "overlay")
    //   : body.setAttribute("data-sidebar-style", "full");
  };

  const getUserObject = () => {
    const { login } = AppConstant;
    return (
      AppStorage.getItemFromStorage(login.storage) || {
        username: null,
        isAdmin: null,
      }
    );
  };

  const isUserAuthorize = (data) => {
    const { username } = getUserObject();
    return username;
  };
  const isRoleAdmin = (data) => {
    const { isAdmin } = getUserObject();
    return isAdmin;
  };

  useEffect(() => {
    //   body.setAttribute("data-typography", "poppins");
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  return (
    <AppContext.Provider
      value={{
        body,
        getUserObject,
        isUserAuthorize,
        isRoleAdmin,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
