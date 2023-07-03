import "./App.css";
import { Routes, Route } from "react-router-dom";
import {Home} from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Table } from "./components/Table";
import {Header} from "./components/Header";
import { Backdrop } from "@mui/material";
import {CircularProgress} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { UserInfo } from "./pages/UserInfo";
const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {//
    mode: 'dark',
    background: {default: '#000000'},// "#121111",
    primary: {
      main: "#2BA0E0", //#181C2D
    },
    secondary:{
      main: "#00A0E3"
    }
  },
});
 
            
          
function App() {

  const {isLoading} = useAuth0(); 
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        ><CircularProgress color="inherit" /></Backdrop>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/user" element={<UserInfo />}/>
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
