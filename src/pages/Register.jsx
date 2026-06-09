import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    setError("");
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode: otp });
      base44.auth.setToken(res.access_token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-5">
          <div className="text-center">
            <h1 className="font-heading text-xl font-bold">Create Account</h1>
            <p className="text-xs text-muted-foreground mt-1">CloudNet Demo Project</p>
          </div>
          {step === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label className="text-xs">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label className="text-xs">Confirm Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-muted-foreground">Enter the verification code sent to {email}</p>
              <div className="space-y-1.5"><Label className="text-xs">Verification Code</Label><Input value={otp} onChange={(e) => setOtp(e.target.value)} required /></div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
              <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => base44.auth.resendOtp(email)}>Resend Code</Button>
            </form>
          )}
          <div className="text-center">
            <Link to="/login" className="text-xs text-muted-foreground hover:underline">Already have an account? Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}