import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/* page.tsx is a client component, so it can't export metadata. This layout
   carries it, the same way /pricing does. */
export const metadata: Metadata = {
	title: "Hardware | Self-hosted AI for construction | construction.live",
	description:
		"The complete system: machine, models and the construction.live harness in one box. 128 GB unified memory, 32 GB dedicated GDDR6, DeepSeek V4 and Qwen3.8-27B pre-tuned. Unlimited use for the office, fully air-gapped for government.",
	alternates: {
		canonical: absoluteUrl("/hardware"),
	},
};

export default function HardwareLayout({ children }: { children: React.ReactNode }) {
	return children;
}
