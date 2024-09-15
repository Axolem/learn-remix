import {
	ActionFunction,
	ActionFunctionArgs,
	json,
	LoaderFunction,
	LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";

export const loader: LoaderFunction = async ({
	params,
}: LoaderFunctionArgs) => {
	const apiResponse = await fetch(
		`https://jsonplaceholder.typicode.com/posts/${params.blogId}`
	);

	const data: {
		id: number;
		title: string;
		body: string;
		userId: number;
	} = await apiResponse.json();

	return json({ data });
};

export async function action({
	request,
	params,
}: ActionFunctionArgs): Promise<ActionFunction> {
	const formData = await request.formData();

	const apiResponse = await fetch(
		`https://jsonplaceholder.typicode.com/posts/${params.blogId}`,
		{
			method: "PATCH",
			body: JSON.stringify({
				title: formData.get("title"),
			}),
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		}
	);

	console.log(await apiResponse.json());

	return json(null, 200);
}

const Blog = () => {
	const { data } = useLoaderData<typeof loader>();
	const { state } = useNavigation();

	return (
		<div className="h-screen flex-col items-center justify-center">
			<Link
				to="/"
				prefetch="render"
			>
				Back
			</Link>
			<div className="flex-col items-center justify-center">
				<h1 className="text-4xl font-bold">{data.title}</h1>
				<p className="mt-4">{data.body}</p>
			</div>

			<Form method="POST">
				<div className="flex flex-col items-center justify-center">
					<input
						name="title"
						type="text"
						className="border border-gray-300 p-1"
					/>
					<button type="submit">
						{state === "submitting" ? "Saving..." : "Save"}
					</button>
				</div>
			</Form>
		</div>
	);
};

export default Blog;
