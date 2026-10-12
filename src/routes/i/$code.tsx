import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GuestLayout, PageIntro } from "@/components/yacht/chrome";
import { useYacht } from "@/lib/yacht/store";

export const Route = createFileRoute("/i/$code")({
  component: InviteOpen,
});

function InviteOpen() {
  const { code } = Route.useParams();
  const { ready, openInvitation } = useYacht();
  const navigate = useNavigate();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let live = true;
    void openInvitation(code).then((dest) => {
      if (!live) return;
      if (dest) navigate({ to: dest, replace: true });
      else setMissing(true);
    });
    return () => {
      live = false;
    };
  }, [ready, code, openInvitation, navigate]);

  if (!missing) return <GuestLayout><section className="px-5 py-16" /></GuestLayout>;
  return (
    <GuestLayout>
      <section className="mx-auto max-w-xl px-5 py-16">
        <PageIntro kicker="CAM Privé" title="This invitation isn't available" body="Please use the link exactly as it was sent." />
      </section>
    </GuestLayout>
  );
}
