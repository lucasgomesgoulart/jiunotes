"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";

export interface Auth1Props {
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  usuarioPlaceholder?: string;
  senhaPlaceholder?: string;
  errorMessage?: string;
  onSubmit?: (usuario: string, senha: string) => void;
}

export function Auth1({
  heading = "Acesso do professor",
  subheading = "JiuNotes — Gestão de aulas de Jiu-Jitsu",
  submitLabel = "Entrar",
  usuarioPlaceholder = "Usuário",
  senhaPlaceholder = "Senha",
  errorMessage,
  onSubmit,
}: Auth1Props) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(usuario, senha);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-5">
        <Card className="border-border bg-muted dark:bg-muted gap-0 rounded-4xl p-2">
          <div className="bg-background h-full w-full rounded-3xl px-5 py-8 shadow-[0_2px_4px_0px_rgba(0,0,0,0.12)]">
            <CardHeader className="space-y-4 pb-6 text-center">
              <div className="text-5xl">🥋</div>
              <div className="space-y-1.5">
                <CardTitle className="text-2xl font-extrabold tracking-tight">
                  {heading}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {subheading}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-3">
                  <div className="relative">
                    <MdPerson className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder={usuarioPlaceholder}
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-14 pl-11 text-base"
                      autoFocus
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="relative">
                    <MdLock className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type={showSenha ? "text" : "password"}
                      placeholder={senhaPlaceholder}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="bg-muted focus-visible:ring-primary/20 focus-visible:border-primary/50 h-14 pr-12 pl-11 text-base"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSenha((v) => !v)}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                      aria-label="Mostrar/ocultar senha"
                    >
                      {showSenha ? (
                        <MdVisibilityOff className="h-5 w-5" />
                      ) : (
                        <MdVisibility className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-destructive text-center text-sm">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  className="from-primary to-primary/70 dark:to-primary/60 h-14 w-full bg-gradient-to-b text-base font-semibold"
                >
                  {submitLabel}
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground shrink-0 text-xs">JiuNotes</span>
                <Separator className="flex-1" />
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
