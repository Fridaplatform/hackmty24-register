import { AuthContextProvider } from "./auth/authContext";
import ReactRouterBrowser from "./router";

function App() {
  return (
    <AuthContextProvider>
      <ReactRouterBrowser />
    </AuthContextProvider>
  );
}

export default App;
