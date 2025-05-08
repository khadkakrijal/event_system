import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

interface ISubmitProps {
  editMode: boolean;
}

const SubmitButton: React.FC<ISubmitProps> = ({ editMode }) => {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className={`${
          pending ? "cursor-not-allowed opacity-60" : ""
        } border submit-button  w-full py-3 mx-auto rounded-md flex-1`}
      >
        {pending ? (
          <BeatLoader color="white" size={14} />
        ) : editMode ? (
          "Save"
        ) : (
          "Submit"
        )}
      </button>
    </>
  );
};

export default SubmitButton;
