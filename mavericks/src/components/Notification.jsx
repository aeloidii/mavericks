import { notificationImages } from "../constants";

const Notification = ({ className, title }) => {
  return (
    <div
      className={`${
        className || ""
      } flex-col items-center p-4 pr-6 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl gap-5`}
    >
      <h6 className="mb-1 font-semibold text-base">{title}</h6>
      <ul className="flex flex-col -m-0.5">
        {notificationImages.map((item, index) => (
          <li
            key={index}
            className="flex w-15 h-15 border-2 border-n-12 rounded-2 overflow-hidden"
          >
            <img
              src={item}
              width={60}
              height={60}
              alt="image"
              className="rounded-xl"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
