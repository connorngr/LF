"use client";

import { useState } from "react";
import { Frame } from "lucide-react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-w-full md:min-w-150 mx-auto p-8 sm:p-10">
      <div className="mb-8">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6">
          <Frame className="w-8 h-8 text-primary-text" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Log In
        </h1>
        <p className="text-base text-foreground/60">
          Welcome to Cn&apos;s LifeFrame
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-5"
      >
        <Input
          type="text"
          label="Username"
          placeholder="Enter admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          className="mt-6"
        >
          Log in
        </Button>
      </form>
    </div>
  );
}
