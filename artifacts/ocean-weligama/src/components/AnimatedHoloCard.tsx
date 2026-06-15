import React from "react";
import "./holo-card.css";
import { LucideIcon } from "lucide-react";

interface AnimatedHoloCardProps {
  icon: LucideIcon;
  className?: string;
}

export const AnimatedHoloCard: React.FC<AnimatedHoloCardProps> = ({ icon: Icon, className = "" }) => {
  return (
    <div className={`card-0 ${className}`} aria-hidden="true">
      <div className="card-0__holo">
        <div className="card-0__layer card-0__layer--back">
          <Icon className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.5} />
        </div>
        <div className="card-0__layer card-0__layer--mid">
          <Icon className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.5} />
        </div>
        <div className="card-0__layer card-0__layer--front">
          <Icon className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
