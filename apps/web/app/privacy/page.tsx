import { AppFrame } from "@/components/app-frame";
import { Sticker, WallLinkButton } from "@/components/sticker-kit";
import { TRANSLATIONS } from "@/lib/i18n";

export default function PrivacyPage() {
  return (
    <AppFrame>
      <Sticker className="mx-auto max-w-[680px] space-y-4 p-6">
        <p className="te-script m-0 text-[26px] leading-[1.55] text-ink" lang="te">
          గోప్యతా విధానం · వ్యక్తిగత డేటా సేకరణ లేదు
        </p>
        <h1 className="anton-title m-0 text-[32px] text-ink">Privacy Policy</h1>
        <p className="text-base font-bold leading-relaxed text-ink">
          No sign-in in the beta. A guest receives an automatic device name (for example,
          &ldquo;Guest Tiger&rdquo;) saved only on your device. No email, no password, no
          personal-data forms, and no tracking of children.
        </p>
        <p className="text-sm font-medium text-ink">
          {TRANSLATIONS.brand.unofficialDisclaimer.en}
        </p>
        <WallLinkButton href="/play" variant="yellow">
          Back to Play →
        </WallLinkButton>
      </Sticker>
    </AppFrame>
  );
}
