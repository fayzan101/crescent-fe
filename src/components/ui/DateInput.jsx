import { FiCalendar } from "react-icons/fi";

const DateInput = ({ name, value, onChange, placeholder, className = "" }) => (
    <div className={`flex items-center justify-between ${className}`}>
        <input
            type="date"
            name={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-transparent outline-none text-sm md:text-base text-gray-900 placeholder-gray-400 flex-1"
        />
    </div>
);

export default DateInput;