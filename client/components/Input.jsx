export default function Input({ ...props }) {
  return (
    <div className="flex flex-col gap-2 text-text">
        <label className="body" htmlFor={props.id}>{props.label}</label>
        <input className='w-full p-2 rounded-md border text-text border-gray-300' {...props} />
    </div>
  );
}

