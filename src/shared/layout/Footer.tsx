import { PlatformSwitch } from "./switchers/PlatformSwitch";
import FooterDesktop from "./desktop/Footer";
import FooterMobile from "./mobile/Footer";

const Footer = () => {
  return (
    <PlatformSwitch
      desktop={<FooterDesktop />}
      mobile={<FooterMobile />}
    />
  );
};

export default Footer;