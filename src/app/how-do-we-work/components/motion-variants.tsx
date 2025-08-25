import { Variants } from "framer-motion";

export const customStyles = `
  :root {
    --background: 36 28 21; /* Dark Brown-Black */
    --foreground: 48 100% 98%; /* Off-White */
    --card: 48 100% 98% / 0.05; /* Frosted Glass */
    --card-foreground: 48 100% 98%; /* Off-White */
    --popover: 36 28 21 / 0.8;
    --popover-foreground: 48 100% 98%;
    --primary: 48 100% 50%; /* Vibrant Yellow */
    --primary-foreground: 36 28 21; /* Dark Brown-Black */
    --secondary: 44 44 44;
    --secondary-foreground: 0 0% 100%;
    --muted: 255 255 255 / 0.5;
    --muted-foreground: 0 0% 100%;
    --accent: 48 100% 50%;
    --accent-foreground: 26 26 26;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 48 100% 98% / 0.15; /* Subtle Border */
    --input: 44 44 44;
    --ring: 48 100% 98% / 0.5;
    --chart-1: 51 100% 50%;
    --chart-2: 48 100% 50%;
    --chart-3: 0 0% 98%;
    --chart-4: 0 0% 100%;
    --chart-5: 0 0% 100%;
    --radius: 0.75rem;
    --sidebar-background: 26 26 26;
    --sidebar-foreground: 0 0% 100%;
    --sidebar-primary: 51 100% 50%;
    --sidebar-primary-foreground: 26 26 26;
    --sidebar-accent: 48 100% 50%;
    --sidebar-accent-foreground: 26 26 26;
    --sidebar-border: 255 255 255 / 0.3;
    --sidebar-ring: 255 255 255 / 0.5;
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
`;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const modernButton = {
  initial: {
    scale: 1,
    boxShadow: "0 0 0 0 hsl(var(--primary) / 0)",
  },
  hover: {
    scale: 1.03,
    boxShadow: [
      "0 0 20px 5px hsl(var(--primary) / 0.2)",
      "0 0 30px 10px hsl(var(--primary) / 0.3)",
      "0 0 20px 5px hsl(var(--primary) / 0.2)",
    ],
    transition: {
      duration: 0.3,
      boxShadow: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  },
  tap: { scale: 0.98 },
};