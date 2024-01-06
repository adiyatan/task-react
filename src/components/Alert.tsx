// Add an alert component
const Alert: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <div className={`alert ${show ? "show" : ""}`}>Dog added successfully!</div>
  );
};
