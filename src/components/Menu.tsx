import { Typer } from "./Typer";

export const Menu = () => {
  const projects = [
    { num: "001", name: "Spotify Clone", url: "https://github.com/tishank5" },
    { num: "002", name: "Netflix UI Replica", url: "https://github.com/tishank5" },
    { num: "003", name: "Interactive Weather App", url: "https://github.com/tishank5" },
    { num: "004", name: "Portfolio 2.0", url: "https://github.com/tishank5/Tishank-Portfoilo" },
    { num: "005", name: "ChatGPT Interface Clone", url: "https://github.com/tishank5" },
    { num: "006", name: "YouTube Dashboard", url: "https://github.com/tishank5" },
    { num: "007", name: "3D Product Viewer", url: "https://github.com/tishank5" },
    { num: "008", name: "E-Commerce Storefront", url: "https://github.com/tishank5" },
    { num: "009", name: "Blogify CMS", url: "https://github.com/tishank5" },
    { num: "010", name: "TaskFlow — Todo Manager", url: "https://github.com/tishank5" },
  ];

  return (
    <div className="menu-component">
      <div className="section-title text-[10px]">LABS</div>
      
      <div className="projects text-[13px]">
        {projects.map((project, index) => (
          <a 
            key={index} 
            href={project.url} 
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="index">{project.num}</span>
            <span className="title">
              <Typer text={project.name} speed={30} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
