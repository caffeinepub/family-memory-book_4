import { Toaster } from "@/components/ui/sonner";
import { TreePine } from "lucide-react";
import { motion } from "motion/react";
import AppLayout from "./components/AppLayout";
import LandingPage from "./components/LandingPage";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

function BrandedLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-5">
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-teal/20"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute inset-0 rounded-full bg-gold/20"
          />
          {/* Logo center */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative w-20 h-20 rounded-full bg-teal flex items-center justify-center shadow-warm"
          >
            <TreePine className="w-9 h-9 text-white" strokeWidth={1.6} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-xl text-charcoal mb-1"
        >
          Kinship
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-body text-sm text-warm-gray"
        >
          Gathering your memories…
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return <BrandedLoader />;
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {identity ? <AppLayout /> : <LandingPage />}
    </>
  );
}
