import { motion } from "framer-motion";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiMenu, FiTwitter, FiX } from "react-icons/fi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleButton = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className="absolute z-50 w-full transition-all duration-300">
      {/* container */}
      <div className="container mx-auto h-16 md:h-20 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* logo and name */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="flex items-center"
        >
          {/* Logo */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-3">
            M
          </div>
          {/* Name */}
          <span className="text-xl bg-gradient-to-r from-gray-300 to-green-100 bg-clip-text text-transparent font-bold ">
            Mati
          </span>
        </motion.div>

        {/* Desktop navigation */}
        <div className="lg:flex hidden space-x-8">
          {["Home", "About", "Projects", "Experience", "Contact"].map(
            (item, index) => {
              return (
                <motion.a
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration0: 300, delay: 0.7 + index * 0.2 }}
                  href="#"
                  key={index}
                  className=" relative text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-violet-600 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              );
            }
          )}
        </div>

        {/* Social icons - Desktop*/}
        <div className="md:flex hidden items-center space-x-4">
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.8 }}
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <FiGithub className="w-5 h-5" />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.8 }}
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <FiTwitter className="w-5 h-5" />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.8 }}
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
          >
            <FiLinkedin className="w-5 h-5" />
          </motion.a>

          {/* Hire Me Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white  transition-all duration-900 cursor-pointer"
          >
            Hire Me
          </motion.div>
        </div>

        {/* Mobile Menu button */}
        <div className="md:hidden flex items-center">
          <motion.button
            whileTap={{ scale: 0.7 }}
            onClick={toggleButton}
            className="text-gray-300"
          >
            {isOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu conatainer */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.5 }}
        className="md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg px-4 py-5 space-y-5"
      >
        <nav className="flex flex-col space-y-3">
          {["Home", "About", "Projects", "Experience", "Contact"].map(
            (item, index) => {
              return (
                <a
                  onClick={toggleButton}
                  key={index}
                  href="#"
                  className="text-gray-300 font-medium py-2"
                >
                  {item}
                </a>
              );
            }
          )}
        </nav>

        {/* Form Buttom */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-5">
            <a href="#">
              <FiGithub className="w-5 h-5 text-gray-300" />
            </a>
            <a href="#">
              <FiTwitter className="w-5 h-5 text-gray-300" />
            </a>
            <a href="#">
              <FiLinkedin className="w-5 h-5 text-gray-300" />
            </a>
          </div>
        </div>

        {/* Button */}

        <button
          onClick={() => toggleButton()}
          className="block mt-5 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-400 font-bold"
        >
          Contact Me
        </button>
      </motion.div>
    </div>
  );
}

export default Header;
