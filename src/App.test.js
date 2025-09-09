import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders campus portal heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/campus portal/i);
  expect(headingElement).toBeInTheDocument();
});
