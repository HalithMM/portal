import { BrowserRouter as Router, Route, Routes } from "react-router-dom" 
import { StudentDash } from "./components/StudentDash" 
import LoginPage from "./components/Studentlogin"
function App() { 

  return (
     <> 
     <Router>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/student/:name" element={<StudentDash/>}/>
        </Routes>
     </Router>
     </>
  )
}

export default App
