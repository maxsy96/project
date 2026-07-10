export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="arabic-page text-right">
      {children}
    </div>
  );
}
