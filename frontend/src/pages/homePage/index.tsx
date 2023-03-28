import { ParentContainer, Label, Input, LabelText } from "./homepage.styled";
import { useState } from 'react';

  const HomePage = () => {
	const [parentContainerColor, setParentContainerColor] = useState('#fff');
  
	const handleParentContainerClick = () => {
	  setParentContainerColor('#0af');
	};
  
	return (<>
	
		<Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	  <Label>
		<Input defaultChecked />
		<LabelText $mode="dark">Foo</LabelText>
	  </Label>
	</>
	);
  };
  
  export default HomePage;
  