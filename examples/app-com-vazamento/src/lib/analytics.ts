import { Analytics } from "@segment/analytics-node";

const analytics = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY! });

export function trackLogin(user: { id: string; email: string; cpf: string }) {
  analytics.identify({
    userId: user.id,
    traits: { email: user.email, cpf: user.cpf },
  });
  analytics.track({ userId: user.id, event: "Login" });
}
