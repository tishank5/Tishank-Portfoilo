import { Typer } from "./Typer";

export const About = () => {
  return (
    <div className="about-component">
      <div className="section-title text-[10px]">INFO</div>
      <p className="text-sm">
        <Typer 
          text="Hey there! I'm Tishank, a creative developer exploring generative art and creative coding. I specialize in React, Vite, HTML, CSS, and JavaScript, crafting clean, responsive, and dynamic interfaces. I enjoy exploring design systems, animations, and modern UI trends to bring ideas to life through code."
          speed={30}
        />
      </p>
    </div>
  );
};
