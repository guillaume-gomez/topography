
interface CardProps {
  children: React.ReactNode;
  kustomClass?: string
  kustomClassBody?: string
}

function Card({ children, kustomClass = "", kustomClassBody = "" }: CardProps) {
  return (
    <div className={"bg-neutral card shadow-sm " + kustomClass}>
      <div className={"card-body " + kustomClassBody}>
        {children}
      </div>
    </div>
  );  
}

export default Card;