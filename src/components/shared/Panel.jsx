import { motion } from 'framer-motion';

export default function Panel({ children, delay = 0, style = {}, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay,
      }}
      className={`panel ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0,
        height: '100%',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
