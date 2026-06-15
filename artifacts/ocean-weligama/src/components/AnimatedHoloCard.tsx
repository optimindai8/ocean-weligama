import { Palmtree } from "lucide-react";
import "./holo-card.css";

export const AnimatedHoloCard = () => {
  return (
    <div className="card-0" aria-hidden="true">
      <div className="card-0__holo">
        <div className="card-0__layer card-0__layer--back">
          <Palmtree className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1.5} />
        </div>
        <div className="card-0__layer card-0__layer--mid">
          <Palmtree className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1.5} />
        </div>
        <div className="card-0__layer card-0__layer--front">
          <Palmtree className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
