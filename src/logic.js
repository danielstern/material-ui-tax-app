export function calculateBracketTaxable(salary, min, max) {
  if (salary < min) return 0
  if (salary >= max) return max - min
  return salary - min
}

export function calculateBracketPayable(salary, min, max, rate) {
  return calculateBracketTaxable(salary, min, max) * +rate
} 