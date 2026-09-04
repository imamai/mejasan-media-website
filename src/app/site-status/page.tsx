export default async function SiteStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; returnAt?: string }>;
}) {
  const { status, message, returnAt } = await searchParams;
  const isMaintenance = status === "maintenance";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-4 py-16 text-center text-[#FAFAFA]">
      <h1 className="font-display text-3xl font-bold">{isMaintenance ? "Site Under Maintenance" : "Site Unavailable"}</h1>
      <p className="mt-3 max-w-md text-[#FAFAFA]/70">
        {message ??
          (isMaintenance
            ? "We are currently performing scheduled maintenance. Please check back shortly."
            : "This site is temporarily unavailable. Please check back later.")}
      </p>
      {returnAt && <p className="mt-2 text-sm text-[#FAFAFA]/50">Expected back: {new Date(returnAt).toLocaleString()}</p>}
    </div>
  );
}
