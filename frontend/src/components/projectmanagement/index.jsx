import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import SideNavbar from "../NavBar/index";

const projects = [
  {
    id: 1,
    name: "Green Energy Plantation",
    description: "A solar-powered afforestation project reducing CO2 emissions.",
    investment: "$500K",
    credits: "50K Carbon Credits/Year",
    image: "https://growbilliontrees.com/cdn/shop/files/bioenergy-plantation-grow-billion-trees.jpg?v=1712566002&width=1500", // Solar-powered afforestation
  },
  {
    id: 2,
    name: "Ocean Cleanup Initiative",
    description: "A project reducing plastic pollution and restoring marine ecosystems.",
    investment: "$750K",
    credits: "70K Carbon Credits/Year",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlVtuW8ya5hk2hcnbEHHJltzZdZHPAkSRn1Q&s", // Ocean cleanup scene
  },
  {
    id: 3,
    name: "Wind Energy Farm",
    description: "A wind-powered energy farm reducing fossil fuel dependency.",
    investment: "$1M",
    credits: "100K Carbon Credits/Year",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsvPA7BWOr3-s9TztYVorf72RdIT-dYWvGgw&s", // Wind turbine farm
  },
];


export default function CarbonProjectDashboard() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Carbon Credit Projects</h1>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md cursor-pointer overflow-hidden"
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <img src={project.image} alt={project.name} className="w-full h-40 object-cover" />
              
              {/* Project Details */}
              <div className="p-6">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <p className="mt-4 text-green-600 font-semibold">Investment: {project.investment}</p>
                <p className="text-blue-500">Credits: {project.credits}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Selected Project Image */}
              <img src={selectedProject.image} alt={selectedProject.name} className="w-full h-40 object-cover rounded-xl mb-4" />

              <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
              <p className="text-gray-600 mt-2">{selectedProject.description}</p>
              <p className="mt-4 text-green-600 font-semibold">Investment: {selectedProject.investment}</p>
              <p className="text-blue-500">Credits: {selectedProject.credits}</p>
              
              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700" onClick={() => alert("Investment successful! Carbon credits will be added to your wallet.")}>Invest</Button>
              <Button className="mt-2 w-full" variant="outline" onClick={() => setSelectedProject(null)}>Close</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
