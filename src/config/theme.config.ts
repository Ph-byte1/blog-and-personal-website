interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly [key: string]: string | undefined;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const siteUrl = (
  import.meta.env.SITE_URL ||
  import.meta.env.PUBLIC_SITE_URL ||
  "https://flipthedata.site"
).replace(/\/$/, "");

export const SITE = {
  name: "FlipTheData",
  description:
    "An independent blog on analyzing all kinds of data, DIY journeys on self hosting and open-source software, and building things. Published occasionally, read closely.",
  url: siteUrl,
  locale: "en-GB",
  language: "en",
  repositoryUrl: "https://github.com/Ph-byte1",
};

export const NAVIGATION = [
  { to: "/", label: "Home", icon: "lucide:home" },
  { to: "/blog", label: "Blog", icon: "lucide:message-circle" },
  { to: "/about", label: "About", icon: "lucide:link" },
  { to: "/contact", label: "Contact", icon: "lucide:mail" },
];

export const CONTACT = {
  email: "p.h.vanlaar@outlook.com",
  socialHandle: "LinkedIn",
  socialUrl: "https://www.linkedin.com/in/philip-h-van-laar/",
};

export const FORMS = {
  contact: {
    action: "",
    method: "post",
    enctype: "application/x-www-form-urlencoded",
  },
  // newsletter: {
  //   action: "",
  //   method: "post",
  //   enctype: "application/x-www-form-urlencoded",
  // },
};

export const SOCIAL_LINKS = [
  { href: "/rss.xml", label: "RSS feed", icon: "rss" },
  { href: CONTACT.socialUrl, label: `${SITE.name} on LinkedIn`, icon: "linkedin" },
  { href: SITE.repositoryUrl, label: `${SITE.name} on GitHub`, icon: "github" },
  { href: `mailto:${CONTACT.email}`, label: "Email", icon: "mail" },
];

export const categories = [
  { slug: "flipthedata", name: "FlipTheData" },
  { slug: "long-read", name: "Long Read" },
  { slug: "learning-notes", name: "Learning Notes" },
  { slug: "flipitonamap", name: "FlipItOnAMap" },
  { slug: "linux", name: "Linux" },
];

export const tags = [
  { slug: "writing", name: "Writing" },
  { slug: "geo", name: "Geo" },
  { slug: "minimalism", name: "Minimalism" },
  { slug: "tools", name: "Tools" },
  { slug: "process", name: "Process" },
  { slug: "web", name: "Web" },
  { slug: "books", name: "Books" },
  { slug: "python", name: "Python" },
  { slug: "reference", name: "Reference" },
  { slug: "diy", name: "DIY" },
  { slug: "projects", name: "Projects" },
];

// export const authors = [
//   {
//     slug: "elena-march",
//     name: "Elena March",
//     bio: "Writer & editor covering design, craft, and slow technology.",
//     longBio:
//       "Elena March writes about the quiet edges of design and technology. Previously an editor at two small magazines, she now publishes essays and field notes from a desk overlooking the harbour.",
//     avatar: "/avatars/elena-march.svg",
//   },
//   {
//     slug: "samuel-okafor",
//     name: "Samuel Okafor",
//     bio: "Software engineer with a soft spot for typography and the open web.",
//     longBio:
//       "Samuel builds tools for writers and reads more than he ships. He believes the best interfaces are the ones you don't notice.",
//     avatar: "/avatars/samuel-okafor.svg",
//   },
//   {
//     slug: "mira-iwasaki",
//     name: "Mira Iwasaki",
//     bio: "Photographer and essayist based between Kyoto and Lisbon.",
//     longBio:
//       "Mira's work sits at the intersection of place, memory, and the everyday object. Her essays have appeared in a number of small but loved publications.",
//     avatar: "/avatars/mira-iwasaki.svg",
//   },
// ];
