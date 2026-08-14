/* Server component. Renders a JSON-LD block for the crawlers.

   `dangerouslySetInnerHTML` is the documented way to do this in Next: React
   would otherwise HTML-escape the JSON and break the parse. The content is
   built from our own schema helpers, never from user input. */
export default function JsonLd({ schema }: { schema: object | object[] }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
