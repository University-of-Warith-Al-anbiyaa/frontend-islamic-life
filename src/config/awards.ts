export interface RecognitionAward {
	id: string;
	titleAr: string;
	titleEn: string;
	organizationAr: string;
	organizationEn: string;
	categoryAr: string;
	categoryEn: string;
	descriptionAr: string;
	descriptionEn: string;
	image: string;
}

export const awards: RecognitionAward[] = [
	{
		id: "research-excellence",
		titleAr: "جائزة التميّز البحثيّ",
		titleEn: "Research Excellence Award",
		organizationAr: "مؤتمر الإسلام حياة العلمي السابع",
		organizationEn: "7th Islamic Life Scientific Conference",
		categoryAr: "البحث والابتكار",
		categoryEn: "Research & Innovation",
		descriptionAr:
			"هديّة نقديّة مقدارها 300 ألف دينار مع درع التميّز البحثيّ لكلّ بحث من البحوث الفائزة العشرة الأوائل.",
		descriptionEn:
			"A cash gift of 300,000 Iraqi dinars and a Research Excellence Shield will be awarded to each of the top ten winning papers.",
		image: "",
	},
];