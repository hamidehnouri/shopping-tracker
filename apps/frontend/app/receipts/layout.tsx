export default function ReceiptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-gray-50">{children}</main>
  );
}
