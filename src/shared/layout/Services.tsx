import { PlatformSwitch } from "@/shared/PlatformSwitch";
import ServicesDesktop from "./desktop/Services";
import ServicesMobile from "./mobile/Services";

const Services = () => {
  return (
    <PlatformSwitch
      desktop={<ServicesDesktop />}
      mobile={<ServicesMobile />}
    />
  );
};

export default Services;