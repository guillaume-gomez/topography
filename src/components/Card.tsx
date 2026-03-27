
interface CardProps {
  children: React.ReactNode;
}

function Card({children}: CardProps) {
  return (
    <div className="bg-neutral card shadow-sm">
      <div className="card-body">
        {children}
      </div>
    </div>
  );  
}

export default Card;