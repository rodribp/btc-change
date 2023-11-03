import { useRouteError } from "react-router-dom";
import NavbarSample from "./components/Navbar";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>  
        <NavbarSample />
        <div className="error-container">
        <p className="error-message">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </p>
        </div>
    </>
  );
}
