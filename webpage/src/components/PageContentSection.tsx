import { cn } from "@/Lib/utils";
import React from "react";

interface PageContentSectionProps {
	children: React.ReactNode;
	className?: string;
}

export default function PageContentSection({ children, className }: PageContentSectionProps) {
	return (
		<div className={cn(className, "overflow-hidden rounded-lg bg-white shadow  my-6")}>
			<div className="px-4 py-5 sm:p-6">{children}</div>
		</div>
	);
}
