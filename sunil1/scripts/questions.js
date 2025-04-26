// Questions.js - Manages the question bank and retrieval

const QuestionsManager = (function() {
  // Question bank - organized by topic and difficulty
  const questionBank = {
    algebra: {
      easy: [
        {
          text: "Solve for x: 2x + 5 = 11",
          options: [
            { text: "x = 2" },
            { text: "x = 3" },
            { text: "x = 4" },
            { text: "x = 5" }
          ],
          correctAnswer: 1,
          explanation: "2x + 5 = 11\n2x = 11 - 5\n2x = 6\nx = 3",
          hint: "Subtract 5 from both sides, then divide by 2."
        },
        {
          text: "Simplify: 3(x + 2) - 5",
          options: [
            { text: "3x + 1" },
            { text: "3x + 6 - 5" },
            { text: "3x - 5" },
            { text: "3x + 1" }
          ],
          correctAnswer: 0,
          explanation: "3(x + 2) - 5 = 3x + 6 - 5 = 3x + 1",
          hint: "First distribute the 3, then combine like terms."
        },
        {
          text: "Factor: x² - 9",
          options: [
            { text: "(x - 3)(x + 3)" },
            { text: "(x - 3)²" },
            { text: "(x + 3)²" },
            { text: "Cannot be factored" }
          ],
          correctAnswer: 0,
          explanation: "x² - 9 = x² - 3² = (x - 3)(x + 3)",
          hint: "This is a difference of squares: a² - b² = (a - b)(a + b)"
        },
        {
          text: "Solve: 2x - 3 > 5",
          options: [
            { text: "x > 3" },
            { text: "x > 4" },
            { text: "x < 4" },
            { text: "x < -1" }
          ],
          correctAnswer: 1,
          explanation: "2x - 3 > 5\n2x > 8\nx > 4",
          hint: "Add 3 to both sides, then divide by 2."
        },
        {
          text: "What is the slope of the line passing through (2, 3) and (4, 7)?",
          options: [
            { text: "1" },
            { text: "2" },
            { text: "3" },
            { text: "4" }
          ],
          correctAnswer: 1,
          explanation: "slope = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2",
          hint: "Use the slope formula: (y₂ - y₁)/(x₂ - x₁)",
          hintFormula: "m = \\frac{y_2 - y_1}{x_2 - x_1}"
        }
      ],
      medium: [
        {
          text: "Solve the system of equations:",
          mathExpression: "\\begin{cases} 2x + y = 7 \\\\ 3x - 2y = 4 \\end{cases}",
          options: [
            { text: "x = 2, y = 3" },
            { text: "x = 3, y = 1" },
            { text: "x = 1, y = 5" },
            { text: "x = 4, y = -1" }
          ],
          correctAnswer: 1,
          explanation: "From the first equation: y = 7 - 2x\nSubstitute into the second equation:\n3x - 2(7 - 2x) = 4\n3x - 14 + 4x = 4\n7x - 14 = 4\n7x = 18\nx = 18/7 = 2.57...\nThen y = 7 - 2(3) = 7 - 6 = 1",
          hint: "Use substitution method. From the first equation, express y in terms of x and substitute into the second equation.",
          hintFormula: "y = 7 - 2x"
        },
        {
          text: "The function f(x) = x² - 6x + 8 has its minimum value at x = ?",
          options: [
            { text: "x = 2" },
            { text: "x = 3" },
            { text: "x = 4" },
            { text: "x = 6" }
          ],
          correctAnswer: 1,
          explanation: "For a quadratic function f(x) = ax² + bx + c, the minimum (when a > 0) occurs at x = -b/(2a).\nf(x) = x² - 6x + 8, so a = 1, b = -6.\nThus, x = -(-6)/(2·1) = 6/2 = 3",
          hint: "For a quadratic function f(x) = ax² + bx + c, the minimum or maximum occurs at x = -b/(2a)",
          hintFormula: "x_{min} = -\\frac{b}{2a}"
        },
        {
          text: "Simplify the expression:",
          mathExpression: "\\frac{x^2 - 4}{x - 2}",
          options: [
            { text: "x - 2, x ≠ 2" },
            { text: "x + 2, x ≠ 2" },
            { text: "x - 2, x ≠ -2" },
            { text: "x + 2, x ≠ -2" }
          ],
          correctAnswer: 1,
          explanation: "x² - 4 = (x - 2)(x + 2)\nSo (x² - 4)/(x - 2) = (x - 2)(x + 2)/(x - 2) = x + 2, where x ≠ 2",
          hint: "Factor the numerator and see if there are common factors with the denominator.",
          hintFormula: "x^2 - 4 = (x-2)(x+2)"
        },
        {
          text: "If f(x) = 2x - 3 and g(x) = x² + 1, find (f ∘ g)(2)",
          options: [
            { text: "7" },
            { text: "9" },
            { text: "11" },
            { text: "13" }
          ],
          correctAnswer: 1,
          explanation: "(f ∘ g)(2) = f(g(2)) = f(2² + 1) = f(5) = 2(5) - 3 = 10 - 3 = 7",
          hint: "First find g(2), then apply f to that result.",
          hintFormula: "(f \\circ g)(x) = f(g(x))"
        },
        {
          text: "Solve for x:",
          mathExpression: "\\log_3(x+1) + \\log_3(x-1) = 2",
          options: [
            { text: "x = 2" },
            { text: "x = 3" },
            { text: "x = 4" },
            { text: "x = 5" }
          ],
          correctAnswer: 2,
          explanation: "Using logarithm property: log₃(x+1) + log₃(x-1) = log₃((x+1)(x-1))\nSo log₃((x+1)(x-1)) = 2\n(x+1)(x-1) = 3² = 9\nx² - 1 = 9\nx² = 10\nx = ±√10\nSince log₃(x-1) requires x-1 > 0, so x > 1, we take x = √10 ≈ 3.16",
          hint: "Use the logarithm property: log₃(a) + log₃(b) = log₃(ab)",
          hintFormula: "\\log_3(x+1) + \\log_3(x-1) = \\log_3((x+1)(x-1))"
        }
      ],
      advanced: [
        {
          text: "Find the derivative of the function:",
          mathExpression: "f(x) = x^3 \\sin(x^2)",
          options: [
            { mathExpression: "3x^2\\sin(x^2) + 2x^4\\cos(x^2)" },
            { mathExpression: "3x^2\\sin(x^2) + 2x^3\\cos(x^2)" },
            { mathExpression: "3x^2\\sin(x^2) - 2x^4\\cos(x^2)" },
            { mathExpression: "x^3\\cos(x^2) + 2x^3\\cos(x^2)" }
          ],
          correctAnswer: 1,
          explanation: "Use the product rule: f'(x) = g'(x)h(x) + g(x)h'(x)\nWhere g(x) = x³ and h(x) = sin(x²).\ng'(x) = 3x²\nh'(x) = cos(x²) · (2x) = 2x·cos(x²)\nSo f'(x) = 3x²·sin(x²) + x³·2x·cos(x²) = 3x²sin(x²) + 2x⁴cos(x²)",
          hint: "Use the product rule and the chain rule",
          hintFormula: "\\frac{d}{dx}[u(x)v(x)] = u'(x)v(x) + u(x)v'(x)"
        },
        {
          text: "Evaluate the indefinite integral:",
          mathExpression: "\\int \\frac{1}{x^2 - 4}\\,dx",
          options: [
            { mathExpression: "\\frac{1}{4}\\ln\\left|\\frac{x+2}{x-2}\\right| + C" },
            { mathExpression: "\\frac{1}{4}\\ln\\left|\\frac{x-2}{x+2}\\right| + C" },
            { mathExpression: "\\frac{1}{8}\\ln\\left|\\frac{x-2}{x+2}\\right| + C" },
            { mathExpression: "\\frac{1}{8}\\ln\\left|\\frac{x+2}{x-2}\\right| + C" }
          ],
          correctAnswer: 0,
          explanation: "First, use partial fractions:\n1/(x² - 4) = 1/((x-2)(x+2)) = A/(x-2) + B/(x+2)\nSolving for A and B, we get A = 1/4 and B = -1/4.\nSo ∫[1/(x² - 4)]dx = (1/4)∫[1/(x-2)]dx - (1/4)∫[1/(x+2)]dx\n= (1/4)ln|x-2| - (1/4)ln|x+2| + C\n= (1/4)ln|(x-2)/(x+2)| + C",
          hint: "Use partial fraction decomposition",
          hintFormula: "\\frac{1}{(x-2)(x+2)} = \\frac{A}{x-2} + \\frac{B}{x+2}"
        },
        {
          text: "Determine all critical points of the function:",
          mathExpression: "f(x) = x^3 - 6x^2 + 9x + 1",
          options: [
            { text: "x = 1 only" },
            { text: "x = 3 only" },
            { text: "x = 1 and x = 3" },
            { text: "No critical points" }
          ],
          correctAnswer: 2,
          explanation: "f'(x) = 3x² - 12x + 9\nSet f'(x) = 0: 3x² - 12x + 9 = 0\n3(x² - 4x + 3) = 0\n3(x - 1)(x - 3) = 0\nSo x = 1 or x = 3",
          hint: "Find the derivative and set it equal to zero",
          hintFormula: "f'(x) = 3x^2 - 12x + 9"
        },
        {
          text: "Solve the differential equation:",
          mathExpression: "\\frac{dy}{dx} = \\frac{x+y}{x}",
          options: [
            { mathExpression: "y = x\\ln|x| + Cx" },
            { mathExpression: "y = x\\ln|x| + C" },
            { mathExpression: "y = \\ln|x| + Cx" },
            { mathExpression: "y = x + C\\ln|x|" }
          ],
          correctAnswer: 0,
          explanation: "Rearrange to get dy/dx - y/x = 1\nThis is a linear first-order differential equation of the form dy/dx + P(x)y = Q(x) where P(x) = -1/x and Q(x) = 1.\nThe integrating factor is e^(∫P(x)dx) = e^(∫(-1/x)dx) = e^(-ln|x|) = 1/x\nMultiplying both sides by 1/x: (1/x)(dy/dx) - (1/x)(y/x) = 1/x\nd/dx(y/x) = 1/x\nIntegrating both sides: y/x = ln|x| + C\ny = x·ln|x| + Cx",
          hint: "This is a linear first-order differential equation. Use an integrating factor.",
          hintFormula: "\\frac{dy}{dx} + P(x)y = Q(x)"
        },
        {
          text: "Find the limit:",
          mathExpression: "\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}",
          options: [
            { text: "0" },
            { text: "1" },
            { text: "3" },
            { text: "∞" }
          ],
          correctAnswer: 2,
          explanation: "lim[x→0] [sin(3x)/x] = lim[x→0] [3·sin(3x)/(3x)]\nWe know that lim[t→0] [sin(t)/t] = 1\nLet t = 3x, so as x→0, t→0\nTherefore: lim[x→0] [sin(3x)/x] = 3·lim[t→0] [sin(t)/t] = 3·1 = 3",
          hint: "Use the limit identity lim[x→0] [sin(x)/x] = 1",
          hintFormula: "\\lim_{x \\to 0}\\frac{\\sin(ax)}{x} = a \\cdot \\lim_{x \\to 0}\\frac{\\sin(ax)}{ax} = a"
        }
      ]
    },
    geometry: {
      easy: [
        {
          text: "What is the area of a rectangle with length 8 cm and width 5 cm?",
          options: [
            { text: "13 cm²" },
            { text: "26 cm²" },
            { text: "40 cm²" },
            { text: "80 cm²" }
          ],
          correctAnswer: 2,
          explanation: "Area of rectangle = length × width = 8 cm × 5 cm = 40 cm²",
          hint: "Use the formula: Area = length × width"
        },
        {
          text: "What is the perimeter of a square with side length 6 m?",
          options: [
            { text: "24 m" },
            { text: "36 m" },
            { text: "12 m" },
            { text: "18 m" }
          ],
          correctAnswer: 0,
          explanation: "Perimeter of square = 4 × side length = 4 × 6 m = 24 m",
          hint: "Use the formula: Perimeter = 4 × side length"
        },
        {
          text: "In a right triangle, if one leg is 3 cm and the hypotenuse is 5 cm, what is the length of the other leg?",
          options: [
            { text: "2 cm" },
            { text: "4 cm" },
            { text: "6 cm" },
            { text: "8 cm" }
          ],
          correctAnswer: 1,
          explanation: "Using the Pythagorean theorem: a² + b² = c²\n3² + b² = 5²\n9 + b² = 25\nb² = 16\nb = 4 cm",
          hint: "Use the Pythagorean theorem: a² + b² = c²",
          hintFormula: "a^2 + b^2 = c^2"
        },
        {
          text: "What is the area of a circle with radius 3 cm?",
          options: [
            { text: "3π cm²" },
            { text: "6π cm²" },
            { text: "9π cm²" },
            { text: "18π cm²" }
          ],
          correctAnswer: 2,
          explanation: "Area of circle = πr² = π × 3² = 9π cm²",
          hint: "Use the formula: Area = πr²",
          hintFormula: "A = \\pi r^2"
        },
        {
          text: "Two angles of a triangle measure 30° and 45°. What is the measure of the third angle?",
          options: [
            { text: "95°" },
            { text: "105°" },
            { text: "115°" },
            { text: "125°" }
          ],
          correctAnswer: 1,
          explanation: "Sum of angles in a triangle = 180°\nThird angle = 180° - 30° - 45° = 105°",
          hint: "The sum of all angles in a triangle is 180°",
          hintFormula: "\\angle A + \\angle B + \\angle C = 180^{\\circ}"
        }
      ],
      medium: [
        {
          text: "Find the volume of a cylinder with radius 4 cm and height 7 cm.",
          options: [
            { text: "28π cm³" },
            { text: "56π cm³" },
            { text: "112π cm³" },
            { text: "128π cm³" }
          ],
          correctAnswer: 2,
          explanation: "Volume of cylinder = πr²h = π × 4² × 7 = π × 16 × 7 = 112π cm³",
          hint: "Use the formula: Volume = πr²h",
          hintFormula: "V = \\pi r^2 h"
        },
        {
          text: "Find the area of a regular hexagon with side length 6 cm.",
          options: [
            { text: "54√3 cm²" },
            { text: "72√3 cm²" },
            { text: "90√3 cm²" },
            { text: "108√3 cm²" }
          ],
          correctAnswer: 1,
          explanation: "Area of regular hexagon = (3√3/2) × s² = (3√3/2) × 6² = (3√3/2) × 36 = 54√3 cm²",
          hint: "The area of a regular hexagon with side length s is (3√3/2) × s²",
          hintFormula: "A = \\frac{3\\sqrt{3}}{2} s^2"
        },
        {
          text: "A 10 foot ladder is leaning against a wall. If the bottom of the ladder is 6 feet from the wall, how high up the wall does the ladder reach?",
          options: [
            { text: "4 feet" },
            { text: "6 feet" },
            { text: "8 feet" },
            { text: "9 feet" }
          ],
          correctAnswer: 2,
          explanation: "Using the Pythagorean theorem:\nheight² + 6² = 10²\nheight² + 36 = 100\nheight² = 64\nheight = 8 feet",
          hint: "Use the Pythagorean theorem, where the ladder length is the hypotenuse",
          hintFormula: "a^2 + b^2 = c^2"
        },
        {
          text: "The angles in a triangle are in the ratio 2:3:7. What is the measure of the largest angle?",
          options: [
            { text: "84°" },
            { text: "105°" },
            { text: "120°" },
            { text: "126°" }
          ],
          correctAnswer: 2,
          explanation: "Let the angles be 2x, 3x, and 7x.\n2x + 3x + 7x = 180° (sum of angles in a triangle)\n12x = 180°\nx = 15°\nLargest angle = 7x = 7 × 15° = 105°",
          hint: "Set up an equation using the ratio and the fact that angles in a triangle sum to 180°",
          hintFormula: "2x + 3x + 7x = 180^{\\circ}"
        },
        {
          text: "Find the length of the altitude to the hypotenuse in a right triangle with sides 5, 12, and 13.",
          options: [
            { text: "3.6" },
            { text: "4.2" },
            { text: "4.8" },
            { text: "5.4" }
          ],
          correctAnswer: 2,
          explanation: "In a right triangle, if h is the altitude to the hypotenuse c, then h = (a×b)/c\nHere, a = 5, b = 12, c = 13\nh = (5×12)/13 = 60/13 = 4.615... ≈ 4.6",
          hint: "The altitude to the hypotenuse can be found using the formula h = (a×b)/c",
          hintFormula: "h = \\frac{a \\times b}{c}"
        }
      ],
      advanced: [
        {
          text: "In a triangle with sides a, b, and c, the law of cosines gives:",
          mathExpression: "c^2 = a^2 + b^2 - 2ab\\cos(C)",
          options: [
            { text: "The angle C" },
            { text: "The side c" },
            { text: "The area of the triangle" },
            { text: "The perimeter of the triangle" }
          ],
          correctAnswer: 0,
          explanation: "Rearranging the law of cosines:\nc² = a² + b² - 2ab·cos(C)\ncos(C) = (a² + b² - c²)/(2ab)\nSo this formula gives us the angle C when we know all three sides.",
          hint: "The law of cosines relates the sides of a triangle to the cosine of one of its angles",
          hintFormula: "\\cos(C) = \\frac{a^2 + b^2 - c^2}{2ab}"
        },
        {
          text: "Find the volume of a sphere with surface area 100π square units.",
          options: [
            { mathExpression: "\\frac{250\\pi}{3}" },
            { mathExpression: "\\frac{500\\pi}{3}" },
            { mathExpression: "100\\pi" },
            { mathExpression: "50\\pi" }
          ],
          correctAnswer: 0,
          explanation: "Surface area of sphere = 4πr²\n4πr² = 100π\nr² = 25\nr = 5\nVolume of sphere = (4/3)πr³ = (4/3)π·5³ = (4/3)π·125 = 500π/3",
          hint: "First find the radius using the surface area formula, then use the volume formula",
          hintFormula: "SA = 4\\pi r^2, V = \\frac{4}{3}\\pi r^3"
        },
        {
          text: "What is the distance between the points (2, 3, 4) and (5, 7, -1) in 3D space?",
          options: [
            { text: "5" },
            { text: "√34" },
            { text: "√35" },
            { text: "√74" }
          ],
          correctAnswer: 2,
          explanation: "Distance = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]\n= √[(5-2)² + (7-3)² + (-1-4)²]\n= √[3² + 4² + (-5)²]\n= √[9 + 16 + 25]\n= √50 = 5√2 ≈ 7.07",
          hint: "Use the 3D distance formula",
          hintFormula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}"
        },
        {
          text: "If θ is an angle in standard position and the terminal side passes through the point (5, -12), what is the value of sin(θ)?",
          options: [
            { text: "5/13" },
            { text: "-5/13" },
            { text: "12/13" },
            { text: "-12/13" }
          ],
          correctAnswer: 3,
          explanation: "For a point (x, y) on the terminal side of angle θ:\nsin(θ) = y/r where r = √(x² + y²)\nr = √(5² + (-12)²) = √(25 + 144) = √169 = 13\nsin(θ) = -12/13",
          hint: "For a point (x, y) on the terminal side of an angle, sin(θ) = y/r where r is the distance from the origin",
          hintFormula: "\\sin(\\theta) = \\frac{y}{r}, r = \\sqrt{x^2 + y^2}"
        },
        {
          text: "Find the equation of the plane containing the points (1, 0, 0), (0, 1, 0), and (0, 0, 1).",
          options: [
            { mathExpression: "x + y + z = 0" },
            { mathExpression: "x + y + z = 1" },
            { mathExpression: "x + y + z = 2" },
            { mathExpression: "x + y + z = 3" }
          ],
          correctAnswer: 1,
          explanation: "To find the equation of a plane, we can use the form ax + by + cz + d = 0.\nVector AB = (0, 1, 0) - (1, 0, 0) = (-1, 1, 0)\nVector AC = (0, 0, 1) - (1, 0, 0) = (-1, 0, 1)\nNormal vector = AB × AC = (1, 1, 1)\nSo the equation is 1(x-1) + 1(y-0) + 1(z-0) = 0\nx + y + z - 1 = 0\nx + y + z = 1",
          hint: "Calculate two vectors in the plane and find their cross product to get the normal vector",
          hintFormula: "ax + by + cz + d = 0"
        }
      ]
    },
    calculus: {
      easy: [
        {
          text: "Find the derivative of f(x) = 3x² + 2x - 5",
          options: [
            { text: "f'(x) = 3x + 2" },
            { text: "f'(x) = 6x + 2" },
            { text: "f'(x) = 6x - 2" },
            { text: "f'(x) = 9x² + 2" }
          ],
          correctAnswer: 1,
          explanation: "f'(x) = d/dx(3x² + 2x - 5) = 3·d/dx(x²) + 2·d/dx(x) - d/dx(5) = 3·2x + 2·1 - 0 = 6x + 2",
          hint: "Use the power rule for each term: d/dx(x^n) = n·x^(n-1)",
          hintFormula: "\\frac{d}{dx}(x^n) = nx^{n-1}"
        },
        {
          text: "What is the derivative of sin(x)?",
          options: [
            { text: "cos(x)" },
            { text: "-cos(x)" },
            { text: "sin(x)" },
            { text: "-sin(x)" }
          ],
          correctAnswer: 0,
          explanation: "The derivative of sin(x) is cos(x)",
          hint: "Remember the derivatives of basic trigonometric functions",
          hintFormula: "\\frac{d}{dx}\\sin(x) = \\cos(x)"
        },
        {
          text: "Evaluate ∫(4x³ + 2x)dx",
          options: [
            { text: "x⁴ + x² + C" },
            { text: "x⁴ + x² - 7x + C" },
            { text: "x⁴ + 2x² + C" },
            { text: "x⁴ + x² + 5 + C" }
          ],
          correctAnswer: 0,
          explanation: "∫(4x³ + 2x)dx = 4·∫x³dx + 2·∫xdx = 4·(x⁴/4) + 2·(x²/2) + C = x⁴ + x² + C",
          hint: "Use the power rule for integration: ∫x^n dx = x^(n+1)/(n+1) + C",
          hintFormula: "\\int x^n dx = \\frac{x^{n+1}}{n+1} + C"
        },
        {
          text: "Find the limit: lim[x→0] (sin(x)/x)",
          options: [
            { text: "0" },
            { text: "1" },
            { text: "∞" },
            { text: "Does not exist" }
          ],
          correctAnswer: 1,
          explanation: "This is a well-known limit: lim[x→0] (sin(x)/x) = 1",
          hint: "This is a fundamental limit in calculus",
          hintFormula: "\\lim_{x \\to 0}\\frac{\\sin(x)}{x} = 1"
        },
        {
          text: "Find ∫(e^x)dx",
          options: [
            { text: "e^x + C" },
            { text: "e^x · x + C" },
            { text: "ln(e^x) + C" },
            { text: "xe^x + C" }
          ],
          correctAnswer: 0,
          explanation: "∫(e^x)dx = e^x + C (since the derivative of e^x is e^x)",
          hint: "The integral of e^x is itself plus a constant",
          hintFormula: "\\int e^x dx = e^x + C"
        }
      ],
      medium: [
        {
          text: "Find the derivative of f(x) = x⁵·sin(x)",
          options: [
            { text: "f'(x) = 5x⁴·sin(x)" },
            { text: "f'(x) = x⁵·cos(x)" },
            { text: "f'(x) = 5x⁴·sin(x) + x⁵·cos(x)" },
            { text: "f'(x) = 5x⁴·sin(x) - x⁵·cos(x)" }
          ],
          correctAnswer: 2,
          explanation: "Using the product rule: f'(x) = u'(x)·v(x) + u(x)·v'(x)\nWhere u(x) = x⁵ and v(x) = sin(x)\nu'(x) = 5x⁴ and v'(x) = cos(x)\nf'(x) = 5x⁴·sin(x) + x⁵·cos(x)",
          hint: "Use the product rule: (u·v)' = u'v + uv'",
          hintFormula: "\\frac{d}{dx}[u(x)v(x)] = u'(x)v(x) + u(x)v'(x)"
        },
        {
          text: "Evaluate the definite integral: ∫[0 to π/2] sin(x)cos(x)dx",
          options: [
            { text: "0" },
            { text: "1/2" },
            { text: "π/4" },
            { text: "1" }
          ],
          correctAnswer: 1,
          explanation: "∫sin(x)cos(x)dx = ∫sin(2x)/2 dx = -cos(2x)/4 + C\n∫[0 to π/2] sin(x)cos(x)dx = [-cos(2x)/4][0 to π/2] = [-cos(π)/4] - [-cos(0)/4] = [1/4] - [-1/4] = 1/2",
          hint: "Use the identity sin(x)cos(x) = sin(2x)/2",
          hintFormula: "\\sin(x)\\cos(x) = \\frac{\\sin(2x)}{2}"
        },
        {
          text: "Find the local extrema of f(x) = x³ - 6x² + 9x",
          options: [
            { text: "Minimum at x = 1, Maximum at x = 3" },
            { text: "Minimum at x = 3, Maximum at x = 1" },
            { text: "Minima at x = 1 and x = 3" },
            { text: "Maximum at x = 0, Minimum at x = 3" }
          ],
          correctAnswer: 0,
          explanation: "f'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3)\nCritical points: x = 1 and x = 3\nf''(x) = 6x - 12\nf''(1) = 6(1) - 12 = -6 < 0 (maximum)\nf''(3) = 6(3) - 12 = 6 > 0 (minimum)",
          hint: "Find critical points where f'(x) = 0, then use the second derivative test",
          hintFormula: "f'(x) = 3x^2 - 12x + 9"
        },
        {
          text: "Solve the differential equation: dy/dx = 3x²y",
          options: [
            { text: "y = Ce^(x³)" },
            { text: "y = Ce^(3x³)" },
            { text: "y = Ce^(x³/3)" },
            { text: "y = Ce^(3x²)" }
          ],
          correctAnswer: 0,
          explanation: "This is a separable differential equation.\ndy/y = 3x²dx\n∫(1/y)dy = ∫3x²dx\nln|y| = x³ + C₁\ny = e^(x³ + C₁) = e^(x³) · e^(C₁) = Ce^(x³) where C = e^(C₁)",
          hint: "This is a separable differential equation. Separate variables and integrate both sides.",
          hintFormula: "\\frac{dy}{y} = 3x^2 dx"
        },
        {
          text: "Find the Taylor series for cos(x) around x = 0 up to the x⁴ term.",
          options: [
            { mathExpression: "1 - \\frac{x^2}{2} + \\frac{x^4}{24}" },
            { mathExpression: "1 - \\frac{x^2}{2} + \\frac{x^4}{4}" },
            { mathExpression: "1 - x^2 + \\frac{x^4}{24}" },
            { mathExpression: "1 - \\frac{x^2}{2} - \\frac{x^4}{24}" }
          ],
          correctAnswer: 0,
          explanation: "Taylor series for cos(x) around x = 0 is: cos(x) = ∑[n=0 to ∞] ((-1)^n · x^(2n)) / (2n)!\nUp to x⁴: cos(x) = 1 - x²/2! + x⁴/4! = 1 - x²/2 + x⁴/24",
          hint: "Taylor series for cos(x) around x = 0 is ∑[n=0 to ∞] ((-1)^n · x^(2n)) / (2n)!",
          hintFormula: "\\cos(x) = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}"
        }
      ],
      advanced: [
        {
          text: "Evaluate the limit:",
          mathExpression: "\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}",
          options: [
            { text: "0" },
            { text: "1/2" },
            { text: "1" },
            { text: "∞" }
          ],
          correctAnswer: 1,
          explanation: "We can use L'Hôpital's rule or the Taylor series for e^x.\nTaylor series: e^x = 1 + x + x²/2 + x³/6 + ...\nSo: (e^x - 1 - x)/x² = (1 + x + x²/2 + ... - 1 - x)/x² = (x²/2 + higher terms)/x² = 1/2 + higher terms\nAs x → 0, the higher terms vanish, giving us 1/2.",
          hint: "Use the Taylor series expansion for e^x",
          hintFormula: "e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\ldots"
        },
        {
          text: "Find the volume of the solid obtained by rotating the region bounded by y = x², y = 0, and x = 2 about the y-axis.",
          options: [
            { text: "2π" },
            { text: "4π" },
            { text: "8π/3" },
            { text: "16π/3" }
          ],
          correctAnswer: 2,
          explanation: "When rotating around the y-axis, we use the disk method with x as a function of y.\nFrom y = x², we get x = √y\nThe volume is V = ∫[0 to 4] 2πx·dy = ∫[0 to 4] 2π√y·dy = 2π·∫[0 to 4] y^(1/2)·dy = 2π·[2y^(3/2)/3][0 to 4] = 2π·[2(4)^(3/2)/3 - 0] = 2π·[2·8/3] = 2π·16/3 = 32π/3",
          hint: "Use the disk/washer method with the y-axis as the axis of rotation",
          hintFormula: "V = \\int 2\\pi x \\, dy"
        },
        {
          text: "Find the general solution to the differential equation:",
          mathExpression: "y'' - 4y' + 4y = 0",
          options: [
            { mathExpression: "y = C_1e^{2x} + C_2xe^{2x}" },
            { mathExpression: "y = C_1e^{2x} + C_2e^{-2x}" },
            { mathExpression: "y = C_1e^{x} + C_2e^{4x}" },
            { mathExpression: "y = C_1e^{2x}\\cos(x) + C_2e^{2x}\\sin(x)" }
          ],
          correctAnswer: 0,
          explanation: "This is a second-order linear homogeneous differential equation with constant coefficients.\nThe characteristic equation is r² - 4r + 4 = 0, which can be factored as (r - 2)² = 0.\nThis gives a repeated root r = 2.\nWhen we have a repeated root r with multiplicity 2, the general solution is y = C₁e^(rx) + C₂xe^(rx).\nSo y = C₁e^(2x) + C₂xe^(2x)",
          hint: "Find the characteristic equation and determine the nature of its roots",
          hintFormula: "r^2 - 4r + 4 = 0"
        },
        {
          text: "Compute the line integral:",
          mathExpression: "\\oint_C (y\\,dx + x\\,dy)",
          options: [
            { text: "0" },
            { text: "2A" },
            { text: "πr²" },
            { text: "2πr" }
          ],
          correctAnswer: 1,
          explanation: "By Green's theorem: ∮[C] (P dx + Q dy) = ∬[D] (∂Q/∂x - ∂P/∂y) dA\nHere, P = y and Q = x, so ∂Q/∂x = 1 and ∂P/∂y = 1\nTherefore: ∮[C] (y dx + x dy) = ∬[D] (1 - 1) dA = ∬[D] 0 dA = 0\nBut actually, using another form of Green's theorem: ∮[C] (x dy - y dx) = 2·Area(D)\nSo ∮[C] (y dx + x dy) = -∮[C] (x dy - y dx) = -2·Area(D) = -2A\nThe negative sign comes from the orientation of C. If C is traversed counterclockwise, we get 2A.",
          hint: "Use Green's theorem, which relates a line integral around a closed curve to a double integral over the region enclosed by the curve",
          hintFormula: "\\oint_C (P\\,dx + Q\\,dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right)\\,dA"
        },
        {
          text: "Find the Laplace transform of f(t) = t·sin(2t).",
          options: [
            { mathExpression: "\\frac{4s}{(s^2+4)^2}" },
            { mathExpression: "\\frac{2s}{(s^2+4)^2}" },
            { mathExpression: "\\frac{2}{(s^2+4)^2}" },
            { mathExpression: "\\frac{4}{(s^2+4)^2}" }
          ],
          correctAnswer: 0,
          explanation: "We can use the property: L{t·f(t)} = -F'(s), where F(s) = L{f(t)}\nWe know that L{sin(at)} = a/(s² + a²)\nSo for sin(2t), L{sin(2t)} = 2/(s² + 4)\nThen L{t·sin(2t)} = -d/ds[2/(s² + 4)] = -2·d/ds[(s² + 4)^(-1)]\n= -2·(-1)·(s² + 4)^(-2)·2s = 4s/(s² + 4)²",
          hint: "Use the property that the Laplace transform of t·f(t) is the negative derivative of the transform of f(t)",
          hintFormula: "\\mathcal{L}\\{t\\cdot f(t)\\} = -\\frac{d}{ds}\\mathcal{L}\\{f(t)\\}"
        }
      ]
    },
    statistics: {
      easy: [
        {
          text: "What is the mean of the data set: 3, 7, 8, 12, 15?",
          options: [
            { text: "7" },
            { text: "8" },
            { text: "9" },
            { text: "10" }
          ],
          correctAnswer: 2,
          explanation: "Mean = (3 + 7 + 8 + 12 + 15) / 5 = 45 / 5 = 9",
          hint: "The mean is the sum of all values divided by the number of values",
          hintFormula: "\\bar{x} = \\frac{\\sum x_i}{n}"
        },
        {
          text: "What is the median of the data set: 4, 1, 7, 2, 6?",
          options: [
            { text: "1" },
            { text: "2" },
            { text: "4" },
            { text: "6" }
          ],
          correctAnswer: 2,
          explanation: "First, arrange the data in ascending order: 1, 2, 4, 6, 7\nSince there are 5 values (odd number), the median is the middle value, which is 4.",
          hint: "The median is the middle value when data is arranged in order",
          hintFormula: "\\text{Median} = \\text{middle value when data is sorted}"
        },
        {
          text: "What is the mode of the data set: 2, 3, 3, 5, 7, 3, 8?",
          options: [
            { text: "2" },
            { text: "3" },
            { text: "5" },
            { text: "8" }
          ],
          correctAnswer: 1,
          explanation: "The mode is the value that appears most frequently. In this data set, 3 appears three times, while all other values appear only once. So the mode is 3.",
          hint: "The mode is the value that occurs most frequently in the data set",
          hintFormula: "\\text{Mode} = \\text{most frequent value}"
        },
        {
          text: "If the probability of an event is 0.25, what is the probability that the event will not occur?",
          options: [
            { text: "0.25" },
            { text: "0.5" },
            { text: "0.75" },
            { text: "1.25" }
          ],
          correctAnswer: 2,
          explanation: "The probability of an event not occurring (complement) = 1 - probability of the event occurring\n= 1 - 0.25 = 0.75",
          hint: "Use the complement rule: P(not A) = 1 - P(A)",
          hintFormula: "P(\\bar{A}) = 1 - P(A)"
        },
        {
          text: "What is the range of the data set: 12, 5, 7, 10, 15, 8?",
          options: [
            { text: "5" },
            { text: "7" },
            { text: "10" },
            { text: "15" }
          ],
          correctAnswer: 1,
          explanation: "Range = maximum value - minimum value = 15 - 5 = 10",
          hint: "The range is the difference between the maximum and minimum values",
          hintFormula: "\\text{Range} = \\max - \\min"
        }
      ],
      medium: [
        {
          text: "What is the standard deviation of the data set: 2, 4, 6, 8, 10?",
          options: [
            { text: "2.83" },
            { text: "3.16" },
            { text: "8.00" },
            { text: "10.00" }
          ],
          correctAnswer: 0,
          explanation: "Mean = (2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6\nSum of squared deviations = (2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)² = 16 + 4 + 0 + 4 + 16 = 40\nVariance = 40 / 5 = 8\nStandard deviation = √8 = 2.83",
          hint: "Standard deviation is the square root of the variance, which is the average of squared deviations from the mean",
          hintFormula: "\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}"
        },
        {
          text: "In a normal distribution with mean 50 and standard deviation 10, approximately what percentage of values lies within one standard deviation of the mean?",
          options: [
            { text: "50%" },
            { text: "68%" },
            { text: "95%" },
            { text: "99.7%" }
          ],
          correctAnswer: 1,
          explanation: "In a normal distribution, approximately 68% of values lie within one standard deviation of the mean. So that's the range from 40 to 60 (50 ± 10).",
          hint: "This is a property of the normal distribution, often called the 68-95-99.7 rule",
          hintFormula: "68\\%-95\\%-99.7\\% \\text{ rule}"
        },
        {
          text: "Two fair six-sided dice are rolled. What is the probability of getting a sum of 7?",
          options: [
            { text: "1/6" },
            { text: "1/9" },
            { text: "1/12" },
            { text: "1/36" }
          ],
          correctAnswer: 0,
          explanation: "The sample space consists of 36 possible outcomes (6 × 6).\nThe sum of 7 can be obtained in 6 ways: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1).\nSo the probability is 6/36 = 1/6.",
          hint: "Count the favorable outcomes (sum = 7) and divide by total possible outcomes",
          hintFormula: "P(\\text{sum} = 7) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}"
        },
        {
          text: "For a binomial distribution with n = 10 and p = 0.3, what is the probability of exactly 4 successes?",
          options: [
            { text: "0.096" },
            { text: "0.200" },
            { text: "0.301" },
            { text: "0.367" }
          ],
          correctAnswer: 1,
          explanation: "For a binomial distribution, P(X = k) = (n choose k) × p^k × (1-p)^(n-k)\nP(X = 4) = (10 choose 4) × 0.3^4 × 0.7^6\n= 210 × 0.0081 × 0.1176 = 0.2001 ≈ 0.200",
          hint: "Use the binomial probability mass function",
          hintFormula: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}"
        },
        {
          text: "The correlation coefficient between two variables is -0.8. This indicates:",
          options: [
            { text: "Strong positive correlation" },
            { text: "Weak positive correlation" },
            { text: "Strong negative correlation" },
            { text: "No correlation" }
          ],
          correctAnswer: 2,
          explanation: "A correlation coefficient of -0.8 is close to -1, indicating a strong negative correlation. This means that as one variable increases, the other tends to decrease.",
          hint: "The correlation coefficient ranges from -1 to 1, with negative values indicating negative correlation",
          hintFormula: "-1 \\leq r \\leq 1"
        }
      ],
      advanced: [
        {
          text: "In hypothesis testing, if the p-value is 0.03 and the significance level (α) is 0.05, what is the conclusion?",
          options: [
            { text: "Fail to reject the null hypothesis" },
            { text: "Reject the null hypothesis" },
            { text: "Accept the alternative hypothesis" },
            { text: "The test is inconclusive" }
          ],
          correctAnswer: 1,
          explanation: "Since the p-value (0.03) is less than the significance level α (0.05), we reject the null hypothesis. This indicates that the observed data is sufficiently inconsistent with the null hypothesis.",
          hint: "Compare the p-value to the significance level (α)",
          hintFormula: "\\text{If } p < \\alpha, \\text{ reject } H_0"
        },
        {
          text: "For a 95% confidence interval, what is the corresponding z-value?",
          options: [
            { text: "1.65" },
            { text: "1.96" },
            { text: "2.33" },
            { text: "2.58" }
          ],
          correctAnswer: 1,
          explanation: "For a 95% confidence interval, we need the z-value that cuts off 2.5% in each tail of the standard normal distribution (since 95% = 100% - 2·2.5%).\nThis z-value is approximately 1.96.",
          hint: "A 95% confidence interval corresponds to a two-tailed z-value with α = 0.05",
          hintFormula: "z_{\\alpha/2} = z_{0.025} \\approx 1.96"
        },
        {
          text: "In an ANOVA test with 3 groups of 5 observations each, what are the degrees of freedom for the between-groups variation?",
          options: [
            { text: "2" },
            { text: "3" },
            { text: "12" },
            { text: "14" }
          ],
          correctAnswer: 0,
          explanation: "In ANOVA, the degrees of freedom for between-groups variation = number of groups - 1 = 3 - 1 = 2",
          hint: "Degrees of freedom for between-groups = k - 1, where k is the number of groups",
          hintFormula: "df_{\\text{between}} = k - 1"
        },
        {
          text: "In a chi-square test for independence with a 4×3 contingency table, what are the degrees of freedom?",
          options: [
            { text: "7" },
            { text: "6" },
            { text: "12" },
            { text: "11" }
          ],
          correctAnswer: 1,
          explanation: "For a chi-square test with an r×c contingency table, the degrees of freedom = (r - 1)(c - 1) = (4 - 1)(3 - 1) = 3 × 2 = 6",
          hint: "For a contingency table with r rows and c columns, df = (r - 1)(c - 1)",
          hintFormula: "df = (r - 1)(c - 1)"
        },
        {
          text: "What is the probability density function of an exponential distribution with parameter λ?",
          options: [
            { mathExpression: "f(x) = \\lambda e^{-\\lambda x} \\text{ for } x \\geq 0" },
            { mathExpression: "f(x) = \\lambda e^{-\\lambda x} \\text{ for } x > 0" },
            { mathExpression: "f(x) = \\frac{1}{\\lambda} e^{-x/\\lambda} \\text{ for } x \\geq 0" },
            { mathExpression: "f(x) = \\frac{1}{\\sqrt{2\\pi\\lambda}} e^{-x^2/(2\\lambda)} \\text{ for all } x" }
          ],
          correctAnswer: 0,
          explanation: "The probability density function of an exponential distribution with parameter λ is f(x) = λe^(-λx) for x ≥ 0, and f(x) = 0 for x < 0.",
          hint: "The exponential distribution models the time between events in a Poisson process",
          hintFormula: "f(x) = \\lambda e^{-\\lambda x} \\text{ for } x \\geq 0"
        }
      ]
    }
  };
  
  // Public methods
  return {
    getQuestions: function(topic, difficulty) {
      if (questionBank[topic] && questionBank[topic][difficulty]) {
        // Return a deep copy of the questions to avoid modifications to the original data
        return JSON.parse(JSON.stringify(questionBank[topic][difficulty]));
      }
      return [];
    },
    
    getTopics: function() {
      return Object.keys(questionBank);
    },
    
    getDifficulties: function() {
      return ['easy', 'medium', 'advanced'];
    },
    
    getTopicName: function(topic) {
      const topicNames = {
        algebra: 'Algebra',
        geometry: 'Geometry',
        calculus: 'Calculus',
        statistics: 'Statistics'
      };
      
      return topicNames[topic] || topic;
    },
    
    getDifficultyName: function(difficulty) {
      const difficultyNames = {
        easy: 'Easy',
        medium: 'Medium',
        advanced: 'Advanced'
      };
      
      return difficultyNames[difficulty] || difficulty;
    }
  };
})();