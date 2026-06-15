"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/States/auth-context";
import Link from "next/link";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@techmart.com", password: "admin123" },
    { role: "Manager", email: "manager@techmart.com", password: "manager123" },
    { role: "Staff", email: "staff@techmart.com", password: "staff123" },
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center bg-background dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl dark:border dark:border-gray-800 dark:bg-gray-800  ">
          <CardContent className="space-y-10">
            <div className="text-center ">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold dark:text-primary-foreground ">
                SignIn with Email
              </h2>
              <p className="dark:text-primary-foreground mt-2">
                Enter your credentials to continue
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Link
                href="#"
                className="flex justify-end text-sm hover:text-primary"
              >
                Forgot Password?
              </Link>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Demo Credentials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {demoCredentials.map((cred, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                                <span className="font-medium">{cred.role}:</span>
                                <div className="text-right">
                                    <div>{cred.email}</div>
                                    <div className="text-gray-500">{cred.password}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card> */}
      </div>
    </div>
  );
}
