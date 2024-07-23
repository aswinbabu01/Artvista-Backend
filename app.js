import React,{useState ,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Allpaintings from "./Pages/Allpaintings";
import Vintage from "./Pages/Vintage";
import Modern from "./Pages/Modern";
import Abstract from "./Pages/Abstract";
import Aboutus from "./Pages/Aboutus";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Loginpage from "./components/Loginpage";
import Registerpage from "./components/Registerpage";
import ArtistPage from "./components/ArtistPage.jsx";
import Payment from "./components/Payment.jsx";
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(()=>{
    axios.get('https://artvista-backend-fnh0.onrender.com/readjsfile',{withCredentials:true})
    .then((resp)=>{
      setData(resp.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  },[])
  return (
    <div className="App">
      <Navbar onSearch={setSearchTerm}/>      
      <Routes>
        <Route path="/" element={<Home data={data.product} />} />
        <Route path="/allpaintings" element={<Allpaintings data={data.product} searchTerm={searchTerm} />} />
        <Route path="/vintage" element={<Vintage data={data.product} searchTerm={searchTerm} />} />
        <Route path="/modern" element={<Modern data={data.product} searchTerm={searchTerm} />} />
        <Route path="/abstract" element={<Abstract data={data.product} searchTerm={searchTerm} />} />
        <Route path="/about" element={<Aboutus/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />        
        <Route path="/artistpage" element={<ArtistPage data={data.product}/>}/>        
        <Route path="/payment" element={<Payment/>}/>
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
