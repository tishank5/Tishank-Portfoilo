export const ProjectGrid = () => {
  const column1 = [
    { num: "001", name: "Project Alpha" },
    { num: "002", name: "Portfolio Website" },
    { num: "003", name: "E-commerce Mockup" },
  ];

  const column2 = [
    { num: "004", name: "Data Visualization" },
    { num: "005", name: "Interactive Dashboard" },
    { num: "006", name: "Web Application" },
  ];

  const column3 = [
    { num: "007", name: "Component Library" },
    { num: "008", name: "Personal Blog" },
    { num: "009", name: "API Integration" },
  ];

  return (
    <div className="grid grid-cols-3 gap-16 max-w-6xl">
      {/* Column 1 */}
      <div className="space-y-3">
        {column1.map((project, index) => (
          <a
            key={index}
            href="#"
            className="block group hover:text-white transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-xs flex-shrink-0">{project.num}</span>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                {project.name}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Column 2 */}
      <div className="space-y-3">
        {column2.map((project, index) => (
          <a
            key={index}
            href="#"
            className="block group hover:text-white transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-xs flex-shrink-0">{project.num}</span>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                {project.name}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Column 3 */}
      <div className="space-y-3">
        {column3.map((project, index) => (
          <a
            key={index}
            href="#"
            className="block group hover:text-white transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-xs flex-shrink-0">{project.num}</span>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                {project.name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
