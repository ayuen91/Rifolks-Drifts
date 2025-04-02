const people = [
	{
		name: "John Doe",
		role: "Founder / CEO",
		imageUrl: "https://placehold.co/400x400",
		bio: "Professional drift racer with over 10 years of experience. Founded Rifolks Drifts to share his passion for drifting with others.",
	},
	{
		name: "Jane Smith",
		role: "Head of Operations",
		imageUrl: "https://placehold.co/400x400",
		bio: "Former motorsport event organizer with expertise in logistics and customer service.",
	},
	{
		name: "Mike Johnson",
		role: "Technical Director",
		imageUrl: "https://placehold.co/400x400",
		bio: "Mechanical engineer with extensive experience in drift car modifications and performance tuning.",
	},
];

export default function AboutPage() {
	return (
		<div className="bg-white py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
						About Rifolks Drifts
					</h2>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Founded in 2020, Rifolks Drifts has become a leading
						provider of high-quality drifting gear and accessories.
						Our mission is to make drifting accessible to
						enthusiasts of all skill levels while maintaining the
						highest standards of quality and safety.
					</p>
				</div>
				<div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
					{people.map((person) => (
						<div
							key={person.name}
							className="flex flex-col items-start"
						>
							<img
								className="aspect-[3/2] w-full rounded-2xl object-cover"
								src={person.imageUrl}
								alt=""
							/>
							<h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
								{person.name}
							</h3>
							<p className="text-base leading-7 text-primary">
								{person.role}
							</p>
							<p className="mt-4 text-base leading-7 text-gray-600">
								{person.bio}
							</p>
						</div>
					))}
				</div>
				<div className="mx-auto mt-16 max-w-2xl lg:mx-0">
					<h3 className="text-2xl font-bold tracking-tight text-gray-900">
						Our Values
					</h3>
					<dl className="mt-6 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
						<div>
							<dt className="font-semibold text-gray-900">
								Quality
							</dt>
							<dd className="mt-1">
								We source only the highest quality products from
								trusted manufacturers to ensure your safety and
								satisfaction.
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-gray-900">
								Innovation
							</dt>
							<dd className="mt-1">
								We constantly seek out the latest technologies
								and techniques to improve the drifting
								experience.
							</dd>
						</div>
						<div>
							<dt className="font-semibold text-gray-900">
								Community
							</dt>
							<dd className="mt-1">
								We believe in fostering a strong community of
								drift enthusiasts through events, workshops, and
								online resources.
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	);
}
