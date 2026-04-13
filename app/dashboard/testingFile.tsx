// "use client"

// import React from "react";
// import { useState, useMemo, useEffect, useCallback } from "react";

// // eslint-disable-next-line react/display-name
// const Child = React.memo(({ onClick }) => {
//     console.log("Child rendered");
//     return <button onClick={onClick}>Click</button>;
// });

// function App() {
//     const [count, setCount] = useState(0);

//     const handleClick = useCallback(() => {
//         console.log("Clicked");
//     }, []);

//     return (
//         <>
//             <button onClick={() => setCount(count + 1)}>Increase</button>
//             <Child onClick={handleClick} />
//         </>
//     );
// }

// export default App