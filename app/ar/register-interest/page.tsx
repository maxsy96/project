import type { Metadata } from "next";
import { InterestRegistrationForm } from "@/components/forms";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "تسجيل الاهتمام",
  description: "تسجيل اهتمامات طلبة كلية الزراعة والطب البيطري للمتابعة مع الفرص المناسبة.",
};

export default function ArabicRegisterInterestPage() {
  return (
    <>
      <PageHero
        eyebrow="تسجيل الطلبة"
        title="أخبر نادي الكلية بنوع الفرص التي تناسب أهدافك."
        description="سجل اهتماماتك في الطب البيطري، الزراعة، علوم الغذاء، البيئة، البحث العلمي، أو القطاع الحكومي حتى يتمكن فريق النادي من متابعة الفرص الأقرب إلى مسارك الأكاديمي والمهني."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">ملاحظة الخصوصية</h2>
          <p className="mt-3 leading-8 text-slate-600">
            تُحفظ بيانات التسجيل بشكل خاص لاستخدامها في مطابقة الفرص والمتابعة من قبل فريق النادي فقط. لا تُنشر هذه البيانات على الصفحات العامة، ولا تُستخدم إلا لأغراض التواصل الطلابي المرتبطة بالفرص والأنشطة.
          </p>
        </aside>
        <InterestRegistrationForm locale="ar" />
      </section>
    </>
  );
}
