
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Task Manager</span>
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          <Button variant="ghost" asChild size="sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}