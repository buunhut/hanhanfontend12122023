import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import BackToTop from "./BackToTop";

const TrangChu = () => {
    const [show, setShow] = useState(true);
    const [prevScrollY, setPrevScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY || window.pageYOffset;
        setPrevScrollY(currentScrollY);
        if (currentScrollY === 0) {
            setShow(true);
        } else if (currentScrollY >= prevScrollY) {
            setShow(false);
        } else {
            setShow(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollY]);

    // console.log('Previous Scroll Y:', prevScrollY);
    return (
        <div id="trangChu">
            {
                show ? (
                    <header>
                        <Header />
                    </header>
                ) : (null)
            }

            <main>
                <Outlet />
            </main>
            {
                show ? (
                    <footer>
                        <Footer />
                    </footer>

                ) : (null)
            }
            <BackToTop />
            <div id="overlay" className="none">

            </div>

        </div>
    );
};

export default TrangChu;
