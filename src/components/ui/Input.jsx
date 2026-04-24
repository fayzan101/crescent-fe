
const Input = ({ placeholder, type = "text" , className = "", value, onChange, ...props}) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} bg-transparent outline-none text-sm md:text-base text-gray-900 placeholder-gray-400 w-full min-h-10`}
        {...props}
    />
);

export default Input;