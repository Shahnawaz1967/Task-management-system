import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Task Manager</span>
        </Link>
        {isAuthenticated && <div className="flex items-center space-x-4 sm:space-x-6">
          <Button size="sm" onClick={logout}>
            Logout
          </Button>
        </div>}
        
      </div>
    </nav>
  );
}
