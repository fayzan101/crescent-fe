const Textarea = ({ placeholder, rows = 4, disabled = false, value, onChange, name, className = "" }) => (
    <textarea
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${className} bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 resize-none w-full`}
    />
);

export default Textarea;