function TitleComponent({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 relative inline-block group max-w-xl">
      <h3 className="font-semibold">{title}</h3>
      {subtitle && <p className="mt-3 mb-1 text-md opacity-80">{subtitle}</p>}
      <span className="block h-1 w-1/3 rounded-full bg-primary-500 transition-all duration-500 ease-in-out group-hover:w-full" />
    </div>
  );
}

export default TitleComponent;
