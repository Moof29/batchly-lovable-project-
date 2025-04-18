
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDevMode } from "@/contexts/DevModeContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DemoAccountsSection } from "@/components/auth/DemoAccountsSection";
import { Separator } from "@/components/ui/separator";

export const AuthPage: React.FC = () => {
  const { login, signup, loading, isAuthenticated } = useAuth();
  const { isDevMode } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showDemoSection, setShowDemoSection] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const from = location.state?.from || "/";

  // Effect to redirect if already authenticated or if dev mode is active
  useEffect(() => {
    console.log("[AuthPage] Checking authentication state:", { isAuthenticated, isDevMode });
    
    if (isAuthenticated || isDevMode) {
      console.log(`[AuthPage] Redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isDevMode, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(loginEmail, loginPassword);
      // Redirect is handled by the useEffect above
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Unable to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signup(signupEmail, signupPassword, firstName, lastName);
      setActiveTab("login");
      toast({
        title: "Account Created",
        description: "Check your email for verification instructions.",
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Unable to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If already authenticated, show a message instead of redirecting immediately
  if (isAuthenticated || isDevMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already Authenticated</CardTitle>
            <CardDescription>
              {isDevMode ? "Dev Mode is active." : "You are already logged in."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20">
            <Logo />
          </div>
          <h1 className="mt-2 text-3xl font-bold">Batchly</h1>
          <p className="text-gray-600">ERP for Businesses</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Batchly</CardTitle>
            <CardDescription>Sign in to your account or create a new one.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-sm text-brand-500 hover:text-brand-600">
                        Forgot?
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              By continuing, you agree to Batchly's Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>

        <div className="w-full">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-center text-sm text-muted-foreground"
            onClick={() => setShowDemoSection(!showDemoSection)}
          >
            {showDemoSection ? (
              <>Hide Demo Options <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Want to try before signing up? <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
          
          {showDemoSection && (
            <>
              <Separator className="my-4" />
              <DemoAccountsSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
