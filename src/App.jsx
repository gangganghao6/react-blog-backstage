import { useState, Suspense, useReducer, createContext, useContext } from "react";
import "./App.scss";
import AllRoutes from "./routes/route";
import { initialState, reducer } from "./reducer/reducer";

export let testContext = createContext(0);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    return { count: 0 };
  });
  return (
    <testContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <AllRoutes />
      </div>
    </testContext.Provider>
  );
}

export default App;
