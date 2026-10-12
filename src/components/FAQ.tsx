import { HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Accordion from "./Accordion";
import { CardHeading, RevealCard } from "./motionKit";

export default function FAQ({ wide = false }: { wide?: boolean }) {
	const { t } = useApp();

	return (
		<section id="faq" className="flex h-full">
			<RevealCard
				lift={false}
				className="flex h-full w-full flex-col p-6 sm:p-8 lg:p-12"
			>
				<CardHeading
					icon={HelpCircle}
					title={t.faq.title}
					lead={t.faq.subtitle}
				/>
				<div className="mt-10 flex-1">
					<Accordion items={t.faq.items} columns={wide ? 2 : 1} />
				</div>
			</RevealCard>
		</section>
	);
}
