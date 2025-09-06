import { FaTwitter, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const socialLinks: Record<"tw" | "fb" | "ig" | "tt", { href: string; icon: JSX.Element }> = {
  tw: {
    href: "https://x.com/solva_africa?t=GTrgJcb-uy8BOkJ94_3cfw&s=09",
    icon: <FaTwitter className="w-5 h-5" />,
  },
  fb: {
    href: "https://www.facebook.com/profile.php?id=61562756354347",
    icon: <FaFacebookF className="w-5 h-5" />,
  },
  ig: {
    href: "https://www.instagram.com/solva_africa?igsh=eGF1eW1rYWx0bWxy",
    icon: <FaInstagram className="w-5 h-5" />,
  },
  tt: {
    href: "https://www.tiktok.com/@solva_africa?_t=ZS-8zTTXNGGpmy&_r=1",
    icon: <FaTiktok className="w-5 h-5" />,
  },
};

const SocialLinks = () => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {Object.entries(socialLinks).map(([key, { href, icon }]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-primary p-2 rounded-full shadow hover:bg-primary hover:text-white transition"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
