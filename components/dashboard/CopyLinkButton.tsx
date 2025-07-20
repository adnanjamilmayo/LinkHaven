"use client";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ link }: { link: string }) {
  return (
    <Button
      className="w-full"
      onClick={() => navigator.clipboard.writeText(link)}
    >
      Copy Link
    </Button>
  );
} 