import { MetaDataItem, MetaDataItemProps } from "./MetaDataItem";
import { Button } from "@/Primitives/Button/Button";
import React from "react";

export interface PageHeadingActionButtonProps {
	text?: string;
	icon?: React.ReactNode;
	onClick?: () => void;
	buttonVariant?: "default" | "outline" | "ghost" | "destructive";
	dialog?: React.ReactNode;
}

/**
 * Props for the PageHeadingWithMetaAndActions component
 */
export interface PageHeadingWithMetaAndActionsProps {
	/**
	 * The page heading text
	 */
	pageHeading: string;
	/**
	 * The meta data items to display
	 */
	metaDataItems?: MetaDataItemProps[];
	/**
	 * The action buttons to display
	 */
	actions?: PageHeadingActionButtonProps[];
}

/**
 * A component that displays a page heading with optional meta data and actions on the right
 * @param pageHeading
 * @param metaDataItems
 * @param actions
 * @constructor
 */
const PageHeadingWithMetaAndActions = ({
	pageHeading,
	metaDataItems,
	actions,
}: PageHeadingWithMetaAndActionsProps) => {
	return (
		<div className="lg:flex lg:items-center lg:justify-between ">
			<div className="min-w-0 flex-1">
				<h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
					{pageHeading}
				</h2>
				{metaDataItems && (
					<div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
						{metaDataItems.map((item, index) => (
							<MetaDataItem key={index} text={item.text} icon={item.icon} />
						))}
					</div>
				)}
			</div>

			{/* Actions */}
			<div className="mt-5 flex lg:ml-4 lg:mt-0">
				<span className="hidden sm:block space-x-2">
					{actions &&
						actions.map((action, index) => {
							if (action.dialog) {
								return <div className={'inline-flex  align-middle'} key={index}>{action.dialog}</div>;
							} else {
								return (
									<Button
										size={"sm"}
										variant={action.buttonVariant || "default"}
										onClick={action.onClick}
										key={index}
									>
										{action.icon}
										{action.text}
									</Button>
								);
							}
						})}
				</span>
			</div>
		</div>
	);
};
export default PageHeadingWithMetaAndActions;
