import crossIcon from "../assets/icon-cross.svg";

function ColumnInput({ id, value, onChange, onDelete }) {
    return (
      <div className="flex items-center w-full">
        <input
          className="bg-transparent flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px]"
          onChange={(e) => onChange(id, e.target.value)}
          type="text"
          value={value}
        />
        <img
          src={crossIcon}
          onClick={() => onDelete(id)}
          className="m-4 cursor-pointer"
        />
      </div>
    );
}  

export default ColumnInput;