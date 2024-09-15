import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export const loader: LoaderFunction = async () => {
	const apiResponse = await fetch(
		"https://jsonplaceholder.typicode.com/posts?_limit=5"
	);

	const data: {
		id: number;
		title: string;
		body: string;
		userId: number;
	}[] = await apiResponse.json();

	return json(
		{
			data,
		},
		apiResponse.status
	);
};

export default function Index() {
	const { data } = useLoaderData<typeof loader>();

	return (
		<div className="h-screen flex-col items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold">Welcome to Remix!</h1>
				<p className="mt-4">This is a new Remix app.</p>
			</div>

			<div className="mt-8">
				<h2 className="text-2xl font-bold">API Data</h2>
				<ul>
					{data.map(
						(post: {
							id: number;
							title: string;
							body: string;
							userId: number;
						}) => (
							<li
								key={post.id}
								className="mt-2"
							>
								<Link
									prefetch="render"
									to={`/post/${post.id}`}
								>
									<h3 className="text-xl font-bold">
										{post.title}
									</h3>
									<p>{post.body}</p>
								</Link>
							</li>
						)
					)}
				</ul>
			</div>
		</div>
	);
}
