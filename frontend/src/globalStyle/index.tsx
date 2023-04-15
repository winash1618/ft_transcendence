import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
	
    *, *::after, *::before {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
    }
	:root {
		--text-gray: #A1A1A1;
		--text-black: #000;
		--main-400: #474747; //change this
		--main-500: #313131; // change this
		--main-600: #272727; // change this
		--main-700: #222222; // change this
		--main-800: #101010;
		--main-900: #000000;
	}
    body, html {
        font-size: 16px;
        margin: 0;
        padding: 0;
		color: #fff;
        width: 100%;
		font-family: 'Poppins';
    } 
	body {
		height: 100vh;
	}
	
	#root {
		height: 100%;
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}
	::-webkit-scrollbar-track {
		/* background: #f1f1f1; */
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}
	::-webkit-scrollbar-thumb {
		background-color: var(--main-400);
		border-radius: 20px;
	}
`;
