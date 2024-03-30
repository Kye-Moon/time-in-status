import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/Primitives/Form";

interface FormInputWrapperProps {
	label?: string;
	description?: string;
	children: React.ReactNode;
}

/**
 * A wrapper component for form inputs
 * Wraps the input in a FormItem, FormLabel, FormControl, FormDescription, and FormMessage
 * Allows for a label and description to be passed in as props and for errors to be displayed via FormMessage
 * @param children the form compoent to wrap eg. <Input/> or <Select/>
 * @param label the label of the form input
 * @param description the description of the form input
 * @constructor
 */
const FormInputWrapper = ({ children, label, description }: FormInputWrapperProps) => {
	return (
		<FormItem className="flex flex-col py-2  ">
			<FormLabel className={"pb-2"}>{label}</FormLabel>
			<FormControl>{children}</FormControl>
			<FormDescription>{description}</FormDescription>
			<FormMessage />
		</FormItem>
	);
};

export default FormInputWrapper;
