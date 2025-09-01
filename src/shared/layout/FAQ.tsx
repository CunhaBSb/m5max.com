import { PlatformSwitch } from "@/shared/PlatformSwitch";
import FAQDesktop from "./desktop/FAQ";
import FAQMobile from "./mobile/FAQ";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

const FAQ = (props: FAQProps) => {
  return (
    <PlatformSwitch
      desktop={<FAQDesktop {...props} />}
      mobile={<FAQMobile {...props} />}
    />
  );
};

export default FAQ;