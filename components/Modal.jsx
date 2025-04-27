export default function Modal({ children, ...props }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center' {...props}>
      {children}
    </div>
  );
}
