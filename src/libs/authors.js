export const AUTHORS = [
  {
    id: 4,
    slug: "sam-gera",
    tag: "",
    name: "Sam Gera",
    title: "Wine Educator & Digital Marketing Expert (WSET LEVEL-2)",
    bio: "Sam Gera is a Content Writer and Digital Marketing Manager at DC Wine & Spirits, with a strong understanding of wines, spirits, and the stories behind them. As a WSET Level 2 Award in Wines holder, he combines professional wine knowledge with creativity to make wine education engaging and accessible. Through his content, Sam helps readers explore the world of wine with ease—from tasting notes and food pairings to simple, practical tips that make wine more approachable and enjoyable for everyone.",
    image: "/authors/sam-gera.png",
    linkedin: "",
    instagram: "",
  },
  {
    id: 3,
    slug: "megha-abbott",
    tag: "DipWSET, PWE",
    name: "Megha Abbott ",
    title: "Proffesional Wine Educator",
    bio: "Megha Abbott Pratap is a Professional Wine Educator (PWE) and WSET Diploma holder with a passion for making wine simple and enjoyable for everyone. Contributing her expertise to DC Wine & Spirits, she specializes in creating insightful wine content, from bottle recommendations and food pairings to regional guides and gifting ideas, helping readers explore the world of wine with confidence and curiosity.",
    image: "/authors/imgi_36_1785342464075.png",
    linkedin: "https://www.linkedin.com/in/megha-abbott-pratap/",
    instagram: "https://www.instagram.com/winewithmegha?stkn=MTJpZXg0eWF0NnB3cA==",
  },
  {
    id: 5,
    slug: "kris-m",
    tag: "",
    name: "Kris M.",
    title: "Content Writer",
    bio: "Krish M is an experienced content writer at DC Wine & Spirits, known for his engaging and reader-friendly writing style. Over time, he has developed a keen interest in topics like lifestyle, food pairings, tasting experiences, wine culture, and gifting ideas, and enjoys turning everyday wine moments into content that's fun, relatable, and easy to read. Krish's writing always focuses on making every piece enjoyable — whether it's a quick read or something worth coming back to.",
    image: "/authors/kris-m.png",
    linkedin: "",
    instagram: "",
  },

  {
    id: 2,
    slug: "editorial-team",
    tag: "",
    name: "Editorial Team",
    title: "Editorial Team",
    bio: "The DC Wine & Spirits editorial team is a passionate group of wine experts and storytellers exploring wines from different cultures around the world. We simplify everything from tasting notes and food pairings to regions and gifting ideas through an easy, everyday lifestyle lens — making wine simple, relatable, and enjoyable for every reader, beginner or enthusiast alike.",
    image: "/authors/dcwineEditorial.png",
    linkedin: "https://www.linkedin.com/company/dc-wine-spirits/",
    instagram: "https://www.instagram.com/dcwineandspirits/",
  },
];

export const getAuthorById = (authorId) =>
  AUTHORS.find((a) => String(a.id) === String(authorId)) || null;

export const getAuthorBySlug = (slug) =>
  AUTHORS.find((a) => a.slug === slug) || null;