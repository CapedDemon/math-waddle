import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import math, { string } from "mathjs";

// const range = math.range(-10, 10, 0.1).toArray();
// const X = math.ones([range.length, range.length]).mul(range);
// const Y = math.transpose(X);

export default function LinearEquation() {
  const [navbar, setNavbar] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  // function to get coefficients and constant term of the
  // linear equations
  const getCoefficients = (eq) => {
    // Parse the equation string to extract coefficients
    const match = eq.match(
      /([+-]?\d*)\s*x\s*([+-]?\d*)\s*y\s*=\s*([+-]?\d*)|([+-]?\d*)\s*x\s*\+\s*([+-]?\d*)\s*y\s*=\s*([+-]?\d*)/
    );

    // Return "failed" if the equation is invalid or does not have both x and y variables
    if (
      !match ||
      (match[1] === "" && match[2] === "") ||
      (match[4] === "" && match[5] === "")
    ) {
      return "failed";
    }

    // Extract the coefficients from the matched groups and convert them to numbers
    const xCoeff = parseInt(match[1]) || parseInt(match[4]) || 1;
    const yCoeff = parseInt(match[2]) || parseInt(match[5]) || 1;
    const constantTerm = parseInt(match[3]) || parseInt(match[6]) || 0;

    // Return the coefficients as an object
    return {
      xCoeff,
      yCoeff,
      constantTerm,
    };
  };

  // main graph func
  const LinearGraphFunc = (input1, input2, divId) => {
    const result1 = getCoefficients(string(input1));
    const result2 = getCoefficients(string(input2));

    if (result1 == "failed" || result2 == "failed") {
      alert("Equation not in the format of ax+by=c");
    } else {
      const x1 = result1["xCoeff"];
      const x2 = result2["xCoeff"];
      const y1 = result1["yCoeff"];
      const y2 = result2["yCoeff"];
      const c1 = result1["constantTerm"];
      const c2 = result2["constantTerm"];

      // Check if a chart instance already exists
      let chart = Chart.getChart(divId);

      // Calculate the intersection point of the two lines
      const xIntersect = (c2 * y1 - c1 * y2) / (x1 * y2 - x2 * y1);
      const yIntersect = (c1 * x2 - c2 * x1) / (x1 * y2 - x2 * y1);

      if (chart) {
        // Update chart data and options
        chart.data.datasets[0].label = `Equation 1: ${x1}x + ${y1}y = ${c1}`;
        chart.data.datasets[0].data = [
          (-c1 - x1 * -10) / y1,
          (-c1 - x1 * 10) / y1,
        ];
        chart.data.datasets[1].label = `Equation 2: ${x2}x + ${y2}y = ${c2}`;
        chart.data.datasets[1].data = [
          (-c2 - x2 * -10) / y2,
          (-c2 - x2 * 10) / y2,
        ];
        chart.data.datasets[2].data = [
          {
            x: xIntersect,
            y: yIntersect,
          },
        ];
        chart.update();
      } else {
        // Create a chart.js line chart configuration object
        const chartConfig = {
          type: "line",
          data: {
            labels: [-10, 10],
            datasets: [
              {
                label: `Equation 1: ${x1}x + ${y1}y = ${c1}`,
                data: [(-c1 - x1 * -10) / y1, (-c1 - x1 * 10) / y1],
                fill: false,
                borderColor: "red",
                tension: 0.1,
              },
              {
                label: `Equation 2: ${x2}x + ${y2}y = ${c2}`,
                data: [(-c2 - x2 * -10) / y2, (-c2 - x2 * 10) / y2],
                fill: false,
                borderColor: "blue",
                tension: 0.1,
              },
              {
                label: "Intersection Point",
                data: [
                  {
                    x: xIntersect,
                    y: yIntersect,
                  },
                ],
                pointRadius: 6,
                pointBackgroundColor: "green",
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "linear",
                ticks: {
                  stepSize: 1,
                  max: 10,
                  min: -10,
                },
              },
              y: {
                type: "linear",
                ticks: {
                  stepSize: 1,
                  max: 10,
                  min: -10,
                },
              },
            },
          },
        };

        // Get the canvas element and create the chart
        const canvas = document.getElementById(divId);
        new Chart(canvas, chartConfig);
      }
    }
  };

  return (
    <div className="p-12 min-h-screen items-center flex-col">
      <nav className="w-full font-mono border-b z-10 text-gray-700 dark:text-white bg-zinc-300 border-gray-800 dark:border-stone-100 dark:bg-gray-800 backdrop-blur-2xl">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl lg:items-center lg:flex lg:px-8">
          <div>
            <div className="flex items-center justify-between py-3 lg:py-5 lg:block">
              <a href="/">
                <h2 className="text-2xl italic font-bold">MATH WADDLE</h2>
              </a>

              <div className="lg:hidden">
                <button
                  className="p-2 t rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 lg:block lg:pb-0 lg:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-8 lg:flex lg:space-x-6 lg:space-y-0">
                <li className="">
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <select className="w-full p-2 text-gray-700 dark:text-white bg-zinc-300 dark:bg-gray-800 ">
                    <option>
                      <Link href="/linearEquation">Linear Equation</Link>
                    </option>
                    <option>Quadratic Equation</option>
                  </select>
                </li>

                <li className="">
                  <Link href="/about">About US</Link>
                </li>
                <li className="">
                  <Link href="/contact">Contact US</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-10 text-center items-center">
        <div id="Linear-Equation">
          <h1 className="font-mono text-base sm:text-xl">
            Linear Equations :-
          </h1>
          <br />
          <div className="font-mono text-sm sm:text-lg px-5">
            <div className="flex sm:flex-row flex-col">
              <p>First equation (x+y=10) :- </p>
              <input
                type="text"
                id="input1"
                value={value1}
                onChange={(e) => {
                  setValue1(e.currentTarget.value);
                }}
                className="mx-2 dark:bg-black border-2 border-black dark:border-white border-solid"
              />
            </div>
            <br />
            <div className="flex flex-col sm:flex-row">
              <p>Second equation (x+2y=20) :- </p>
              <input
                type="text"
                id="input2"
                value={value2}
                onChange={(e) => {
                  setValue2(e.currentTarget.value);
                }}
                className="mx-2 dark:bg-black border-2 border-black dark:border-white border-solid"
              />
            </div>
            <br />
            <button
              onClick={(e) => LinearGraphFunc(value1, value2, "graph")}
              className="border-solid border-2 p-1 border-black dark:border-white"
            >
              Submit
            </button>
          </div>
          <div>
            <canvas id="graph" width="400" height="400"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
