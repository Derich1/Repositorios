import Main from "./pages/Main";
import Repositorio from "./pages/Repositorio";
import {BrowserRouter, Routes, Route} from "react-router-dom"

export default function AppRoutes(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>} />
                <Route path="/repositorio/:repositorio" element={<Repositorio/>} />
            </Routes>
        </BrowserRouter>
    )
}