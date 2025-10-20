import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { About } from "./components/About";
import { Menu } from "./components/Menu";
import { RotatingGreeting } from "./components/RotatingGreeting";
import { ShaderBackground } from "./components/ShaderBackground";

export default function App() {
  return (
    <div className="application-component">
      <ShaderBackground />
      
      <div className="content-layer">
        <Header />
        
        <div className="container">
          <div className="wrapper">
            <RotatingGreeting />
            <About />
            <Menu />
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
