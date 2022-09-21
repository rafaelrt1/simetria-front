import { createContext, useReducer } from "react";

export const LoginContext = createContext();
// export const SearchContext = createContext();

const reducerLogin = (state, action) => {
    return { isLoggedIn: action.isLoggedIn, session: action.session };
};

const getInitialStateLogin = () => {
    return {
        isLoggedIn: false,
        session: null
    }
}

const reducerSearch = (state, action) => {
    return { date: action.date, professional: action.professional, service: action.service };
};

const getInitialStateSearch = () => {
    let savedData = JSON.parse(localStorage.getItem('search'));

    if (Object.keys(savedData).length !== 0) {
        return {
            date: savedData.date,
            professional: savedData?.professional ? savedData.professional : '',
            service: savedData.service
        }    
    } else { 
        return {
            date: '',
            professional: null,
            service: ''
        }
    }
}

export function ContextProvider(props) {
    const [stateLogin, dispatchLogin] = useReducer(reducerLogin, getInitialStateLogin());
    const [stateSearch, dispatchSearch] = useReducer(reducerSearch, getInitialStateSearch());
 
    return (
        <LoginContext.Provider value={{stateLogin, dispatchLogin,stateSearch, dispatchSearch}}>
            {props.children}
        </LoginContext.Provider>
    );
}