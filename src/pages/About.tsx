import { ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="GitHub"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

import { openUrl } from "@tauri-apps/plugin-opener";

export function About() {
  const handleOpenLink = async (url: string) => {
    await openUrl(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">About</h2>
        <p className="text-sm text-muted-foreground">Information about Valo Discord RPC</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-valorant-red">
                <span className="text-sm font-bold text-white">V</span>
              </div>
              Valo Discord RPC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A modern Discord Rich Presence client for Valorant that displays your in-game status
              on Discord. Built with Tauri, React, and Rust for optimal performance.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">0.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-mono">Tauri v2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="font-mono">Apache-2.0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-valorant-red" />
                <span>Real-time Discord presence updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-valorant-red" />
                <span>Shows map, agent, rank, and party information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-valorant-red" />
                <span>Automatic game state detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-valorant-red" />
                <span>System tray support for background operation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-valorant-red" />
                <span>Customizable presence display options</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Links & Credits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  void handleOpenLink("https://github.com/krvntzkl/valorant-rpc");
                }}
              >
                <GitHubIcon className="mr-2 h-4 w-4" />
                GitHub Repository
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  void handleOpenLink("https://valorant-api.com");
                }}
              >
                Valorant API
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-valorant-red" /> for the Valorant community
              </p>
              <p className="mt-2">
                This project is not affiliated with Riot Games or Discord. Valorant and related
                trademarks are property of Riot Games.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
