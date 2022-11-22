import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css";
import { ContextProvider, LoginContext } from "./context";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Agendar from "./pages/Agendar";
import Horarios from "./pages/Horarios";
import { useContext } from "react";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";

function App() {
    const searchContext = useContext(LoginContext);

    let deferredPrompt;
    const addBtn = document.querySelector(".add-button");
    // addBtn.classListstyle.display = 'none';
    window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = "block";

        addBtn.addEventListener("click", (e) => {
            // hide our user interface that shows our A2HS button
            addBtn.style.display = "none";
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the A2HS prompt");
                } else {
                    console.log("User dismissed the A2HS prompt");
                }
                deferredPrompt = null;
            });
        });
    });

    return (
        <BrowserRouter>
            <ContextProvider>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route exact path="/" element={<Home />} />
                    <Route path="agendar" element={<Agendar />} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="minha-agenda" element={<Agenda />} />
                </Routes>
            </ContextProvider>
        </BrowserRouter>
        // <button class="add-button">Add to home screen</button>
    );
}

export default App;
