import type { Metadata } from "next";
import { Building2, FlaskConical, Globe2, GraduationCap, Leaf, Stethoscope, University, UsersRound } from "lucide-react";
import { PartnerSubmissionForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "الشركاء",
  description: "صفحة الشركاء العربية لنادي كلية الزراعة والطب البيطري.",
};

const partnerExamplesAr = [
  "عيادات ومستشفيات بيطرية تقدم أيام ملاحظة أو تدريباً عملياً للطلبة.",
  "مزارع وشركات غذائية ومشاريع استدامة تتيح زيارات ميدانية وتعلماً تطبيقياً.",
  "مختبرات بحثية وجهات حكومية ومنظمات وجامعات خارج الدولة تفتح مسارات جديدة لطلبة الكلية.",
];

const partnerTypes = [
  ["عيادات بيطرية", Stethoscope],
  ["مزارع", Leaf],
  ["شركات غذائية", FlaskConical],
  ["منظمات بيئية", Globe2],
  ["مختبرات بحثية", GraduationCap],
  ["جهات حكومية", Building2],
  ["جامعات خارج الدولة", University],
  ["مؤسسات غير ربحية", UsersRound],
];

export default function ArabicPartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="الشركاء"
        title="شاركوا فرصكم مع طلبة كلية الزراعة والطب البيطري."
        description="يمكن للمؤسسات، المزارع، العيادات، المختبرات، الشركات، الخريجين، أعضاء هيئة التدريس، الجهات الحكومية، والجامعات خارج الدولة إرسال فرص موجهة للطلبة ليقوم النادي بمراجعتها وتنظيم عرضها."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div>
          <SectionHeader
            title="لماذا الشراكة مع نادي الكلية؟"
            description="يساعد النادي الشركاء على الوصول إلى طلبة مهتمين ومؤهلين من خلال مسار أكثر تنظيماً وشفافية للفرص الطلابية."
          />
          <div className="mt-6 grid gap-3">
            {partnerExamplesAr.map((item) => (
              <div key={item} className="rounded-lg bg-white p-4 text-sm leading-7 text-slate-600 shadow-sm">{item}</div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {partnerTypes.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-4">
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
        <PartnerSubmissionForm locale="ar" />
      </section>
    </>
  );
}
