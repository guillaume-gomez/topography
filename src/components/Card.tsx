
interface CardProps {
  children: React.ReactNode;
  kustomClass?: string
}

function Card({ children, kustomClass = "" }: CardProps) {
  return (
    <div className={"bg-neutral card shadow-sm " + kustomClass}>
      <div className="card-body">
        {children}
      </div>
    </div>
  );  
}

export default Card;