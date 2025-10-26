export default function Toast({ children, ...props }) {
  return (
    <div className="bg-background text-text px-4 py-2 rounded-md" {...props}>
      {children}
    </div>
  );
}
