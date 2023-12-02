import { fireEvent, render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import LandingCard from "./components/Card";

/*LandingCard*/
test("Render Test", () => {
  //do something
  render(<LandingCard onGoClick={() => {}} />);
  expect(screen.getByText("Where are you headed?")).toBeInTheDocument();
  expect(screen.getByLabelText("Destination")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
});
test("updates input value on change", () => {
  render(<LandingCard onGoClick={() => {}} />);
  const input = screen.getByLabelText("Destination");
  fireEvent.change(input, {
    target: { value: "123 This is a test Location st." + " @!#$" },
  });
  expect(input.value).toBe("123 This is a test Location st." + " @!#$");
});
