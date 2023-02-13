import { NavLink } from "react-router-dom";

import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-12 mb-5 bg-[#7600bc] py-5 text-white">
      <h1 className="text-2xl font-semibold">Redux Blog</h1>
      <nav>
        <ul>
          <NavLink to="/" className="mr-5 text-xl font-medium">
            Home
          </NavLink>
          <NavLink to="/post-form" className="text-xl font-medium">
            Post
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
