import { useState, useEffect } from "react";
import * as BrowserStorage from "../utils/browserStorage";

// Adding hook that rerenders when local storage changes
function useLocalStorage(fn) {
  if (!fn) throw Error("Local storage selector is required");
  if (typeof fn !== "function")
    throw Error("Local storage selector should be a function");

  const [, triggerRender] = useState(0);

  useEffect(() => {
    function handleStorageChange() {
      console.log("Browser storage changed!");

      triggerRender((prev) => prev + 1);
    }
    window.addEventListener("storageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storageChange", handleStorageChange);
    };
  }, []);

  return fn(BrowserStorage);
}

export default useLocalStorage;
