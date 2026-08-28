"use client";

import NumberFlow from "@number-flow/react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useState } from "react";

const Skiper89 = () => {
  const { scrollYProgress } = useScroll();
  const [progressPercent, setProgressPercent] = useState(0);

  const clampedProgress = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const progressAsPercent = useTransform(clampedProgress, (value) =>
    Math.round(value * 100),
  );

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value);
  });

  return (
    <div className="skiper-nav-progress" aria-hidden="true">
      <motion.div className="skiper-nav-progress-fill" style={{ scaleX: clampedProgress }} />
      <NumberFlow className="skiper-nav-progress-value" value={progressPercent} suffix="%" />
    </div>
  );
};

export { Skiper89 };
