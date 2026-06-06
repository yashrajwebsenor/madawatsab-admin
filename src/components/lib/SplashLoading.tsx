import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";

const SplashLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#faf9f8] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <img
                src="/assets/images/logo.png"
                alt="Madawatsab Logo"
                className="w-36 h-auto drop-shadow-2xl"
              />
            </motion.div>
            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full scale-75 opacity-50" />
          </div>

          <div className="flex flex-col items-center gap-6">
            <Spinner
              size="lg"
              color="primary"
              classNames={{
                circle1: "border-b-primary",
                circle2: "border-b-primary",
                label: "text-primary font-semibold tracking-wider",
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0, duration: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-gray-500 font-medium tracking-[0.2em] uppercase text-[10px]">
                Initializing Dashboard
              </p>
              <div className="w-48 h-[1px] bg-gray-200 relative overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-primary w-1/2"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashLoading;
