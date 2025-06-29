import { motion } from "framer-motion";

const tileVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      type: "spring",
    },
  }),
};

const Section2 = ({
  title = "Start the Conversation",
  subtitle = "Connect with your team, customers, or community in seconds.",
}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-100 px-12 py-20">
      <div className="text-center border-2">
        <h2 className="text-4xl font-bold mb-4 text-primary">{title}</h2>
        <p className="text-base-content/70 text-lg mb-10 max-w-xl mx-auto">{subtitle}</p>

        <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto p-6">
          {[...Array(12)].map((_, i) => (
            <motion.div
              custom={i}
              variants={tileVariants}
              initial="hidden"
              animate="visible"
              key={i}
              className={`w-24 h-24 rounded-2xl ${
                i % 3 === 0
                  ? "animate-pulse"
                  : i % 2 === 0
                  ? "animate-bounce"
                  : "animate-pulse"
              } flex items-center justify-center text-3xl shadow hover:scale-105 transition-transform`}
            >
              {i % 3 === 0 ? "💬" : i % 2 === 0 ? "👥" : "⚡"
              }
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section2;
