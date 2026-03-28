export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const useFooter = (copyright?: string, brandName?: string | React.ReactNode) => {
  const currentYear = new Date().getFullYear();
  const effectiveCopyright = copyright || (brandName ? `© ${currentYear} ${typeof brandName === 'string' ? brandName : ''}. All rights reserved.` : "");

  return {
    effectiveCopyright
  };
};
