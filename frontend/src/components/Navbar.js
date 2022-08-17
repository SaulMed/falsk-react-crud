import React from 'react';
import { Link } from 'react-router-dom';

export const NavBar = () => (
    <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container container-fluid">
            <Link className="navbar-brand text-white" to="/">
                Flask & React
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse ms-auto" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/about">
                            About
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/users">
                            Users
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
)