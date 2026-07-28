interface AuthHeaderProps {
    title: string;
    description: string;
  }
  
  export function AuthHeader({ title, description }: AuthHeaderProps) {
    return (
      <div className="mb-6 text-center">
        <h1 className="heading-lg mb-2 font-primary">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    );
  }