import { ClipLoader } from "react-spinners";
import "./styles.css";

interface Props {
  message: string;
}

export const Loading: React.FC<Props> = ({ message }) => {
  return (
    <div className="loading">
      <div className="container">
        <label>{message}</label>
        <ClipLoader color={"#192a56"} loading={true} size={32} />
      </div>
    </div>
  );
};
