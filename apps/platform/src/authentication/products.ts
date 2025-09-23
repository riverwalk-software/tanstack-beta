const products = [
  {
    name: "Advanced Scala",
    productId: "73abe058-3442-4d03-93c2-dfcd33e590ea",
    slug: "advanced-scala",
    benefits: ["advanced-scala"],
  },
  {
    name: "All-Access Monthly Membership",
    productId: "9024b949-5fe8-4842-87df-89fae03bbe89",
    slug: "all-access-monthly-membership",
    benefits: ["advanced-scala", "kotlin-essentials", "scala-essentials"],
  },
  {
    name: "All-Access Yearly Membership",
    productId: "be50319a-8306-47ad-b6ea-91b816fe632f",
    slug: "all-access-yearly-membership",
    benefits: ["advanced-scala", "kotlin-essentials", "scala-essentials"],
  },
  {
    name: "Kotlin Essentials",
    productId: "6c1ca4fc-0539-42ee-95fb-ee202c3f01ec",
    slug: "kotlin-essentials",
    benefits: ["kotlin-essentials"],
  },
  {
    name: "Scala Essentials",
    productId: "dbba6cce-80cb-499e-a676-0d23ad84d83d",
    slug: "scala-essentials",
    benefits: ["scala-essentials"],
  },
  {
    name: "The Kotlin Bundle",
    productId: "c592cbba-f149-42b3-be2f-aa23bb3154a0",
    slug: "the-kotlin-bundle",
    benefits: ["kotlin-essentials"],
  },
  {
    name: "The Scala Bundle",
    productId: "226705fa-bb58-4b52-bd7e-8528baec86b8",
    slug: "the-scala-bundle",
    benefits: ["scala-essentials", "advanced-scala"],
  },
] as const

export { products }
