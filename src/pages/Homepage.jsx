import { NavLink } from "react-router-dom";
import PageNav from "../components/PageNav";

export default function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>Homepag</h1>
      <NavLink to="/pricing">Pricing</NavLink>
    </div>
  );
}
