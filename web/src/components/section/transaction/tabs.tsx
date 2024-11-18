import { BookLock, Car, Hotel, MapPinned, PlaneTakeoff } from "lucide-react";

export const tabs = [
  {
    label: "Horizon Only",
    value: "horizon",
    icon: <BookLock size={14} />
  },
  {
    label: "Travel",
    value: "travel",
    icon: <PlaneTakeoff size={14} />
  },
  {
    label: "Accommodation",
    value: "accommodation",
    icon: <Hotel size={14} />
  },
  {
    label: "Tour",
    value: "tour",
    icon: <MapPinned size={14} />
  },
  {
    label: "Transportation",
    value: "transport",
    icon: <Car size={14} />
  },
]
