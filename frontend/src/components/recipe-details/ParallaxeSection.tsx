import { motion, useScroll, useTransform } from "framer-motion";
import placeholderImage from "../../assets/placeholder-image.jpg";
export default function ParallaxSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section
      style={{ height: "100vh", overflow: "hidden", position: "relative" }}
    >
      <motion.img
        src={placeholderImage}
        style={{
          y,
          width: "100%",
          height: "120%",
          objectFit: "cover",
          position: "absolute",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: 120,
          color: "white",
        }}
      >
        <h1>Recettes Premium</h1>
      </div>
    </section>
  );
}
