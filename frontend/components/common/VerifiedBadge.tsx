import { Badge } from "@/components/ui/Badge";
import { CheckBadgeIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function VerifiedBadge({ text, className }: { text: string; className?: string }) {
  // Seed offers are fictional in demo mode, so never imply a real verification.
  if (siteConfig.showDemoNotice) return null;

  return (
    <Badge variant="verified" className={className}>
      <CheckBadgeIcon size={12} strokeWidth={2.2} />
      {text}
    </Badge>
  );
}
