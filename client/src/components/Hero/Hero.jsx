import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";
const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">

            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 2,
                type: "ease-in",
              }}
            >
              Search New Zealand's largest range of houses and properties for sale
            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            <span>Finding the perfect home for sale in New Zealand </span>
            <span>Forget all difficulties in finding a properties for you</span>
          </div>



          <div className="flexCenter stats">
            <div className="flexColCenter stat">

            </div>




          </div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}

          >

          </motion.div>
        </div>

      </div>
    </section>

  );
};

export default Hero;
