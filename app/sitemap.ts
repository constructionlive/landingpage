import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.construction.live";

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/solutions`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/pricing`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/book`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.4,
		},
		{
			url: `${baseUrl}/signin`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
