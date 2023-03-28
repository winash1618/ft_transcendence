import { ParentContainer } from "./homepage.styled";
import { useState } from 'react';

  const HomePage = () => {
	const [parentContainerColor, setParentContainerColor] = useState('#fff');
  
	const handleParentContainerClick = () => {
	  setParentContainerColor('#0af');
	};
  
	return (
	  <ParentContainer onClick={handleParentContainerClick} backgroundColor={parentContainerColor}>
		Home Page
	  </ParentContainer>
	);
  };
  
  export default HomePage;
  