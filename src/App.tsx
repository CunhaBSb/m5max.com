import { AppProviders } from "@/app/providers/AppProviders";
import AppRoutes from "@/app/router/AppRoutes";

const App = () => (
  <AppProviders>
    <AppRoutes />
  </AppProviders>
);

export default App;