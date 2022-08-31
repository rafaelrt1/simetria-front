import { createContext, useReducer } from "react";

export const LoginContext = createContext();

const reducer = (state, action) => {
    return { isLoggedIn: action.isLoggedIn, session: action.session };
};

const getInitialState = () => {
    return {
        isLoggedIn: false,
        session: null
    }
}

export function ContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, getInitialState());
 
    return (
        <LoginContext.Provider value={{ state, dispatch }}>
            {props.children}
        </LoginContext.Provider>
    );
}