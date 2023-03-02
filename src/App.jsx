import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import {
  Box,
  Input,
  MenuItem,
  Select,
  InputLabel,
  TextField,
  FormControl,
  CircularProgress,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
  Paper
} from '@mui/material'
import delay from 'delay'
import axios from 'axios'
import './App.css'

async function loadData(year, setData) {
  while (true) {
    console.info("Attempting to establish connection with server...")
    try {
      setData(null)
      const { data } = await axios.get(`http://localhost:5000/tax-calculator/brackets/${year}`)
      const { tax_brackets } = data
      console.table(tax_brackets)
      setData(tax_brackets)
      return
    } catch (e) {
      console.info("Failed to fetch data. Retrying", e)
      await delay(1000)
    }
  }
}

function calculateBracketTaxable(salary, min, max) {
  if (salary < min) return 0
  if (salary >= max) return max - min
  return salary - min
}

function calculateBracketPayable(salary, min, max, rate) {
  return calculateBracketTaxable(salary, min, max) * +rate
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function App() {
  const [data, setData] = useState(null)
  const [year, setYear] = useState("2019")
  const [salary, setSalary] = useState(100000)
  const [payableMap, setPayableMap] = useState({})
  const [totalPayable, setTotalPayable] = useState(0)

  /**
   * This effect fires twice intentionally due to Strict Mode 
   * See https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode/61897567#61897567
   *  */
  useEffect(() => {
    loadData(year, setData)
  }, [year])

  /**
   * Recomputes computed values (total payable) when data is updated,
   * Optimizes performance on slow machines or with large data set.
   */

  useEffect(() => {
    if (!data) return
    const nextPayableMap = {}
    let nextTotalPayable = 0
    for (let i = 0; i < data.length; i++) {
      const { min, max, rate } = data[i]
      const payable = calculateBracketPayable(salary, min, max, rate)
      nextPayableMap[i] = payable.toFixed(2)
      nextTotalPayable += payable
    }
    setPayableMap(nextPayableMap)
    setTotalPayable(nextTotalPayable)
  }, [data, salary])


  return (
    <div className="App">
      <Box>
        <h1>
          Tax Whisperer
        </h1>
        <h2>
          The Code Whisperer's Official Tax Calculation App
        </h2>
        <form style={{ marginBottom: 24 }}>
          <FormControl>
            <TextField labelid="salary-input-label" label="Salary" type="number" min={1} value={salary} onChange={e => setSalary(+e.target.value)} />
          </FormControl>
          <FormControl>
            <InputLabel id="year-select-label">Tax Year</InputLabel>
            <Select
              label="Tax Year"
              value={year}
              onChange={e => { console.log("Set year...", e.target.value); setYear(e.target.value) }}
              labelid="year-select-label" >
              <MenuItem value="2019">2019</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
            </Select>
          </FormControl>
        </form>
        <Box>
          {!data && <Box style={{ justifyItems: "center" }}>
            <CircularProgress />
            Communicating with server...
          </Box>}
        </Box>

        {data && <Box>
          <TableContainer component={Paper}>
            <Table>

              <TableHead>
                <TableRow>
                  <TableCell>
                    Bracket Floor
                  </TableCell>
                  <TableCell>
                    Bracket Ceiling
                  </TableCell>
                  <TableCell>
                    Rate
                  </TableCell>
                  <TableCell>
                    Amount Payable
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(({ min, max, rate }, i) => <TableRow key={i}>
                  <TableCell>
                    {/* ${min} */}
                    {currency.format(min)}
                  </TableCell>
                  <TableCell>
                    {max ? currency.format(max) : "∞"}
                  </TableCell>
                  <TableCell>
                    {(rate * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {currency.format(payableMap[i])}
                  </TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Salary
                </TableCell>
                <TableCell>
                  Total Taxes Payable
                </TableCell>
                <TableCell>
                  Effective Rate
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {currency.format(salary)}
                </TableCell>
                <TableCell>
                  {currency.format(totalPayable)}
                </TableCell>
                <TableCell>
                  <strong>
                    {(totalPayable / salary * 100).toFixed(2)}%
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* 😎 I'll drive 😎 */}


        </Box>}

      </Box>
    </div>
  )
}

export default App
