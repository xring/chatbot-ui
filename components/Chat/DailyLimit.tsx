import { IconRefresh } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
  onDailyLimit: () => void;
}

export const DailyLimit: FC<Props> = ({ onDailyLimit }) => {
  return (
    <div className="fixed sm:absolute bottom-4 sm:bottom-8 w-full sm:w-1/2 px-2 left-0 sm:left-[280px] lg:left-[200px] right-0 ml-auto mr-auto">
      <div className="text-center mb-4 text-red-500">You have reached the daily request limit. See you tomorrow.</div>
    </div>
  );
};
