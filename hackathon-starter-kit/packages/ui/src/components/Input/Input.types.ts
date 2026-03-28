import { HTMLMotionProps } from 'framer-motion';

export interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {
  label?: string;
  error?: string;
}
