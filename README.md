# Code Whisperer's Tax App
![image](https://user-images.githubusercontent.com/4268152/222445790-389fcc04-0b95-49e6-8e52-29f5743f9a57.png)

## Usage
1. Install dependencis
```bash
npm install
```

2. Make sure the backend is running on `port:5000`:
```bash
docker pull ptsdocker16/interview-test-server
docker run --init -p 5000:5000 -it ptsdocker16/interview-test-server
```

3. Run the app
```
npm run dev
```

4. Open your web browser to the URL displayed in the terminal.

## Running the Linter

To run ESLint, type

```
npm run lint
```

## Navigating the Project

**This project only deviates from the vanilla Vite-React-JS template within the file:**
- `src/App.jsx`