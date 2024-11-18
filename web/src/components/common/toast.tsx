import Lottie from "lottie-react";
import successLoader from "../../assets/loaders/success.json"

interface CommonToastProps {
  message: string
}

export default function CommonToast({ message }: CommonToastProps) {
  return (
    <div className="bg-white p-4 flex flex-row items-center rounded-xl shadow-lg w-full">
      <p className="text-xs font-primary">{message}</p>
      <Lottie animationData={successLoader} loop={true} className="w-[26px] h-[26px]" />
    </div>

  )
}
