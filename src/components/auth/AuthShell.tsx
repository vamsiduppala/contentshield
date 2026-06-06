import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup as createAccount } from "../../lib/localAuth";
import { Logo } from "../layout/Logo";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type AuthShellProps = {
  mode: "login" | "signup";
};

export function AuthShell({ mode }: AuthShellProps) {
  const signup = mode === "signup";
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (signup) await createAccount({ firstName, lastName, email, password });
      else await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-void text-white lg:grid-cols-[1.02fr_.98fr]">
      <section className="relative hidden overflow-hidden border-r border-line bg-mesh p-10 lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-acid">Creator revenue safety</p>
          <h1 className="text-6xl font-semibold leading-none tracking-tight">Scan before the upload decision gets expensive.</h1>
          <p className="mt-6 text-lg leading-8 text-white/60">A premium review layer for speech, captions, and on-screen text, backed by real-time AI scanning.</p>
        </motion.div>
        <Card className="max-w-md p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/44">Monetization Safety Score</span>
            <span className="rounded-full bg-acid/12 px-3 py-1 text-xs font-semibold text-acid">Production state</span>
          </div>
          <strong className="mt-4 block text-6xl">92</strong>
          <div className="mt-5 h-2 rounded-full bg-white/10"><span className="block h-2 w-[92%] rounded-full bg-acid" /></div>
        </Card>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.55 }} className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan">{signup ? "Create account" : "Welcome back"}</p>
          <h2 className="text-4xl font-semibold tracking-tight">{signup ? "Start your workspace." : "Log in to ContentShield AI."}</h2>
          <p className="mt-3 leading-7 text-white/54">{signup ? "Create a real account to begin scanning." : "Use your credentials to access your reports."}</p>

          <form className="mt-8 grid gap-4" noValidate onSubmit={submit}>
            {signup && (
              <div className="grid grid-cols-2 gap-4">
                <label className="grid gap-2 text-sm font-medium text-white/72">
                  First Name
                  <Input placeholder="Maya" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-white/72">
                  Last Name
                  <Input placeholder="Srinivasan" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" />
                </label>
              </div>
            )}
            <label className="grid gap-2 text-sm font-medium text-white/72">Email<Input placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/72">Password<Input placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete={signup ? "new-password" : "current-password"} /></label>
            {error && <p className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
            <Button className="mt-2 w-full" type="submit" disabled={loading}>{loading ? "Working..." : signup ? "Create account" : "Log in"}</Button>
            <Button variant="secondary" type="button" className="w-full">Continue with Google</Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/48">
            {signup ? "Already have access? " : "New to ContentShield AI? "}
            <Link to={signup ? "/login" : "/signup"} className="font-semibold text-cyan hover:text-white">{signup ? "Log in" : "Create account"}</Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
