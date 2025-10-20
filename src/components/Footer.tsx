import { TypedLink } from "./TypedLink";

export const Footer = () => {
  return (
    <footer className="footer-component">
      <p className="status text-xs">
        Email: <a href="mailto:connect.tishank@gmail.com" className="link">connect.tishank@gmail.com</a>
      </p>
      
      <nav className="social flex gap-4">
        <TypedLink 
          href="https://www.linkedin.com/in/tishankpawar/" 
          text="LinkedIn"
          className="link text-xs"
        />
        <TypedLink 
          href="https://github.com/tishank5" 
          text="Github"
          className="link text-xs"
        />
        <TypedLink
          href="https://twitter.com/tishank5"
          text="Twitter"
          className="link text-xs"
        />
      </nav>
    </footer>
  );
};
