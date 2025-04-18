import { Text } from "@/components/ui/text";
import React from "react";

/**
 * FixedText component
 *
 * A wrapper around the Text component that sets adjustsFontSizeToFit to false by default.
 * Accepts all other Text component props.
 */
export const FixedText = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentProps<typeof Text>
>((props, ref) => {
	return <Text adjustsFontSizeToFit={false} {...props} ref={ref} />;
});
