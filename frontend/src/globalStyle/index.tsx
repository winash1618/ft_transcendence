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
        width: 100%;
		font-family: 'Poppins';
    } 
	body {
		height: 100vh;
	}
	
	#root {
		height: 100%;
	}
`;