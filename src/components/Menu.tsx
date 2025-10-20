import { Typer } from "./Typer";

export const Menu = () => {
  const projects = [
    { num: "001", name: "Spotify Clone" },
    { num: "002", name: "Netflix UI Replica" },
    { num: "003", name: "Interactive Weather App" },
    { num: "004", name: "Portfolio 2.0" },
    { num: "005", name: "ChatGPT Interface Clone" },
    { num: "006", name: "YouTube Dashboard" },
    { num: "007", name: "3D Product Viewer" },
    { num: "008", name: "E-Commerce Storefront" },
    { num: "009", name: "Blogify CMS" },
    { num: "010", name: "TaskFlow — Todo Manager" },
  ];

  return (
    <div className="menu-component">
      <div className="section-title text-[10px]">LABS</div>
      
      <div className="projects text-[13px]">
        {projects.map((project, index) => (
          <a key={index} href="#" className="link">
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
