import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiGithub, FiLinkedin, FiMenu, FiTwitter, FiX } from "react-icons/fi";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openContactForm, setOpenContactForm] = useState(false);

  const toggleButton = () => setIsOpen((prev) => !prev);
  const openForm = () => {
    setIsOpen(false);
    setOpenContactForm(true);
  };
  const closeForm = () => setOpenContactForm(false);

  return (
    <header className="sm:absolute z-50 w-full transition-all duration-300">
      {/* Container */}
      <div className="container mx-auto h-16 md:h-20 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        {/* Logo + Name */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="flex items-center"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-gray-500 to-gray-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-3">
            M
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-gray-300 to-green-100 bg-clip-text text-transparent font-bold">
            Mati
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-6 xl:space-x-8">
          {["Home", "About", "Projects", "Experience", "Skills"].map(
            (item, index) => (
              <motion.a
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.15 }}
                key={index}
                className="relative text-gray-800 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-300 group pb-1 text-sm sm:text-base md:text-lg"
              >
                {item}
                {/* underline */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-violet-600 dark:bg-violet-400 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            )
          )}
        </div>

        {/* Social Icons + Hire Me */}
        <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
          {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
            <motion.a
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.8 }}
              href="#"
              className="text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400"
            >
              <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.a>
          ))}

          <motion.button
            type="button"
            onClick={openForm}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-100 text-violet-700 font-bold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-900 cursor-pointer text-sm sm:text-base"
          >
            Hire Me
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <motion.button
            type="button"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.4 }}
          className={` ${
            isOpen ? "flex flex-col" : "hidden"
          } md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg px-4 py-5 space-y-5`}
        >
          <nav className="flex flex-col space-y-3">
            {["Home", "About", "Projects", "Experience", "Contact"].map(
              (item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  onClick={toggleButton}
                  className="text-gray-800 dark:text-gray-200 font-medium py-2 text-base"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-5">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#">
                  <Icon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={openForm}
            className="block mt-5 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-400 text-white font-bold"
          >
            Contact Me
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {openContactForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full p-6 max-w-md sm:max-w-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-300">
                  Get in Touch
                </h1>
                <button onClick={closeForm}>
                  <FiX className="w-5 h-5 font-extrabold text-gray-800 dark:text-gray-300" />
                </button>
              </div>

              <form className="text-black dark:text-white space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-800 dark:text-gray-300 font-medium mb-1"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-violet-600 bg-gray-100 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-800 dark:text-gray-300 font-medium mb-1"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-violet-600 bg-gray-100 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-800 dark:text-gray-300 font-medium mb-1"
                  >
                    Message:
                  </label>
                  <textarea
                    rows={4}
                    id="message"
                    placeholder="Type your message"
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-violet-600 bg-gray-100 dark:bg-gray-700"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2 px-4 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg shadow-md hover:shadow-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 text-white mt-3"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
