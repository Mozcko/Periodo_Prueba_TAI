import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Marcar que el componente está siendo renderizado en el cliente
    setIsClient(true);

    // Configurar el estado inicial y el evento resize solo en el cliente
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) {
    // TODO: Mientras se espera al cliente, devolver un placeholder para evitar parpadeo
    return (
      <nav className="bg-gray-800 top-0 sticky z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="bg-gray-600 rounded-lg h-10 w-24 text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
          >
            logo
          </a>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 top-0 sticky z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="/"
          className="bg-gray-600 rounded-lg h-10 w-24 text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
        >
          logo
        </a>
        <button
          onClick={toggleNavbar}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            ></path>
          </svg>
        </button>
        <div
          className={`overflow-hidden md:overflow-auto transition-all duration-300 ${
            isOpen ? "max-h-screen" : "max-h-0"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 bg-gray-800 md:bg-gray-800 border-transparent">
            <li className="w-full md:w-auto">
              <a
                href="/#posts"
                className="w-full md:w-16 my-1 text-center bg-gray-600 h-6 rounded-lg text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                posts
              </a>
            </li>
            <li className="w-full md:w-auto">
              <a
                href="/#create"
                className="w-full md:w-16 my-1 text-center bg-gray-600 h-6 rounded-lg text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                create
              </a>
            </li>
            <li className="w-full md:w-auto">
              <a
                href="/login"
                className="w-full md:w-16 my-1 text-center bg-gray-600 h-6 rounded-lg text-white flex items-center justify-center hover:bg-gray-500 transition-colors duration-300"
              >
                login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
