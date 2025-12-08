import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";
import { FooterSection } from "./ui/footer-section";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <FooterSection />

      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group border-2 border-white/20"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 rounded-full bg-red-600 blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-300 -z-10"></div>

            <FaArrowUp className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default Footer;