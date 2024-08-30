import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { SERVER_URL } from "@/lib/constants"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const navigate = useNavigate()

  const {login}= useAuth();

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await fetch(`${SERVER_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
          const data = await response.json()
          // Handle storing the token and navigating
          login(data.token)
        } else {
          console.error("Login failed")
        }
      } catch (error) {
        console.error("Error during login:", error)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>
            <Button className="w-full mt-6" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <a href="/forgot-password" className="text-sm text-center text-blue-500 hover:underline">
            Forgot your password?
          </a>
          <div className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
            Register
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
