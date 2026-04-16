import { site } from "@/data/site";
import type { StrapiSiteConfig } from "@/types/strapi";

interface FooterProps {
  siteConfig?: StrapiSiteConfig | null;
}

const Footer = ({ siteConfig }: FooterProps = {}) => {
  const name = siteConfig?.name ?? site.name;
  return (
    <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:items-center">
        <p>
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
