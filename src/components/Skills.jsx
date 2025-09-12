import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
  FaNodeJs,
} from "react-icons/fa";
import {
  SiMongodb,
  SiDocker,
  SiRedux,
  SiTailwindcss,
  SiMongoose,
  SiExpress,
} from "react-icons/si";

function Skills() {
  const skills = {
    Frontend: [
      { name: "HTML5", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "CSS3", icon: <FaCss3Alt className="text-blue-500" /> },
      { name: "JavaScript", icon: <FaJsSquare className="text-yellow-400" /> },
      { name: "React", icon: <FaReact className="text-cyan-400" /> },
      { name: "Redux Toolkit", icon: <SiRedux className="text-purple-500" /> },
      {
        name: "Tailwind CSS",
        icon: <SiTailwindcss className="text-sky-500" />,
      },
    ],
    Backend: [
      { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
      { name: "MongoDB", icon: <SiMongodb className="text-green-600" /> },
      { name: "Express js", icon: <SiExpress className="text-green-600" /> },
      { name: "Mongoose", icon: <SiMongoose className="text-green-600" /> },
    ],

    SoftSkills: [
      { name: "Teamwork 🤝" },
      { name: "Problem-Solving 🧩" },
      { name: "Communication 🗣️" },
    ],
  };

  return (
    <section className="py-16 bg-white" id="skills">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          ⚡ Skills & Tech Stack
        </h2>

        {/* Technical Skills */}
        <div className="grid md:grid-cols-3 gap-12">
          {Object.entries(skills).map(([category, skillList]) => (
            <div
              key={category}
              className="bg-gray-50 rounded-2xl shadow-lg p-6 
                         hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {category}
              </h3>
              <ul className="space-y-3">
                {skillList.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 
                               text-gray-700 hover:text-gray-900 transition"
                  >
                    {skill.icon && (
                      <span className="text-2xl">{skill.icon}</span>
                    )}
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
