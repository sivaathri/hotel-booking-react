import React from "react";
import { motion } from "framer-motion";

const loaderVariants = {
  animationOne: {
    y: [0, -20, 0],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 1,
        ease: "easeInOut",
      },
    },
  },
};

const AnimatedLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <motion.div
      style={{ width: 60, height: 60, borderRadius: "50%", background: "#4f46e5" }}
      variants={loaderVariants}
      animate="animationOne"
    />
  </div>
);

export default AnimatedLoader;
