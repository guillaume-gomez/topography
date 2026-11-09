
interface CardProps {
  children: React.ReactNode;
  kustomClass?: string
}

function Card({ children, kustomClass = "" }: CardProps) {
  return (
    <div className={"bg-neutral card shadow-sm " + kustomClass}>
      <div className="card-body p-3">
        {children}
      </div>
    </div>
  );  
}

export default Card;